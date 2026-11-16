# Document Upload POC: Report

**Task:** Lounge module, Task 1. Branch `feat/document-upload-poc`.

A form with **Name, Image, Aadhaar and Qualification**, validated with Zod in the browser and on the server. Files are stored in **Vercel Blob**, and MongoDB stores each file's `path` and `size`. Submitted forms can be listed, edited and deleted.

## Try it

1. Add these to `.env.local`:

   ```bash
   BLOB_READ_WRITE_TOKEN=   # Vercel → Storage → your Blob store → .env.local tab
   MONGODB_URI=
   RESEND_API_KEY=          # already required on main: every server action fails to load without it
   ```

2. Run `npm install`, then `npm run dev`.
3. Open `/dashboard/documents`, or use **Services → Documents** in the header.

## Requirements

| Requirement                                    | How it is met                                                                                                                      |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| React Hook Form with 4 fields                  | `DocumentProfileForm`, used for both create and edit                                                                               |
| Name                                           | 2 to 100 characters                                                                                                                |
| Image, at most 1 MB                            | JPEG/JPG only (see question 1 below)                                                                                               |
| Aadhaar: one PDF, at most 1 MB                 | One PDF                                                                                                                            |
| Qualification: several PDFs, each at most 1 MB | 1 to 4 PDFs                                                                                                                        |
| Zod on the client and the server               | Shared rules in `schema/documentProfileSchema.ts`: a client schema (`FileList`) and server schemas (`File`, then the saved record) |
| Vercel Blob for files, MongoDB for paths       | `services/blob.service.ts` with `put`/`del`; the `documentprofiles` collection                                                     |
| List, edit and delete                          | `/dashboard/documents`, `/new`, `/[id]/edit`, and a Delete button with a confirmation                                              |

## Submit flow

```text
Browser: React Hook Form + Zod (types, sizes, counts)
  → for each new file, one server action call:
      Zod on the server (field, size, type checked from the file's first bytes)
      → put() to Vercel Blob → returns { path, size }
  → final server action: Zod on the whole record (paths must be in our Blob folder)
      → MongoDB create or update
  → if any step fails, the files uploaded by this attempt are deleted from Blob
```

**Why one request per file:** Vercel rejects request bodies over 4.5 MB. A full form (1 MB image, 1 MB Aadhaar and four 1 MB PDFs) is about 6 MB. Each file is at most 1 MB, so the server-action limit is raised to 2 MB in `next.config.ts`.

## Stored record

```json
{
  "name": "Shinu Rathod",
  "image": {
    "path": "https://….public.blob.vercel-storage.com/documents/image/photo-x1y2.jpg",
    "size": 95232
  },
  "adhaar": {
    "path": "https://…/documents/adhaar/aadhaar-x1y2.pdf",
    "size": 116736
  },
  "qualification": [
    {
      "path": "https://…/documents/qualification/degree-x1y2.pdf",
      "size": 55296
    }
  ],
  "createdAt": "…",
  "updatedAt": "…"
}
```

**On edit:**

- A file input left empty keeps the stored file.
- Stored qualification PDFs can be removed one by one, and new ones added, up to 4 in total.
- After the record is saved, Blob files it no longer uses are deleted.

**On delete:** the record and all its Blob files are removed.

## Files

| Layer          | Files                                                                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Model          | `models/documentProfile.ts`                                                                                                                     |
| Schema         | `schema/documentProfileSchema.ts`                                                                                                               |
| Services       | `services/blob.service.ts`, `services/documentProfile.service.ts`                                                                               |
| Server actions | `actions/documentProfile.action.ts`                                                                                                             |
| UI             | `Components/DocumentProfileForm.tsx`, `DocumentProfileList.tsx`, `DeleteDocumentProfileButton.tsx`, `StoredFileLink.tsx`                        |
| Pages          | `app/dashboard/documents/page.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`                                                                        |
| Constants      | `constants/documentProfile.ts` (routes, limits, accepted types, labels, messages), `constants/fileSize.ts`, two regexes in `constants/regex.ts` |
| Shared         | `utils/file.utils.ts`, types in `types/index.ts`                                                                                                |
| Wiring         | the `index.ts` exports, a Header menu link, `next.config.ts` (action body limit, Blob image domain)                                             |

## Review comments addressed

Each rule was applied across the whole PR, not only on the commented lines:

- **Constants in `constants/`.** Every fixed value moved out of the schema file and the server action into `constants/documentProfile.ts`. The schema file now holds only Zod schemas.
- **Destructuring.** The list's `.map`, the form's new-files list, `StoredFileLink`'s props, the service mappers and the action's upload result are all destructured.
- **Regex in constants.** The Blob random-suffix regex and the file-name regex are in `constants/regex.ts`, next to `MONGO_ID_REGEX`.
- **`size-N`.** The list thumbnail uses `size-20` and the form preview `size-14`.
- **Types in `types/`.** The service's MongoDB record type moved to `types/index.ts`.

## Verification

Tested in Chrome against a real MongoDB database and a real Vercel Blob store, in the OS dark mode.

| Check                                                                                       | Result                    |
| ------------------------------------------------------------------------------------------- | ------------------------- |
| Empty form: all four required errors                                                        | Pass                      |
| PDF as the image, JPEG as Aadhaar, a 1.1 MB PDF, 5 qualification files: each rejected       | Pass                      |
| Invalid forms upload nothing to Blob                                                        | Pass                      |
| Create: 6 files in Blob, record listed, every link returns HTTP 200, image renders          | Pass                      |
| Edit: rename, replace Aadhaar, remove one PDF and add one; replaced files deleted from Blob | Pass                      |
| Edit that would leave 5 qualifications: rejected                                            | Pass                      |
| Delete: record and all its files removed                                                    | Pass                      |
| Text contrast on these pages                                                                | At least 4.59:1           |
| ESLint and Prettier on changed files                                                        | Clean                     |
| `tsc`                                                                                       | No errors in the new code |

## Questions for you

1. **Image type.** Your comment says the image may be `jpeg, jpg, pdf`. This POC accepts pictures only. Adding PDF is a one-line change to `ACCEPTED_FILE_TYPES` in `constants/documentProfile.ts`.
2. **Who can edit.** Nothing requires sign-in, so anyone can edit or delete any record. Should this sit behind the Better Auth session?
3. **Blob access.** The store is public: anyone with a file's link can open it, and the link includes a random part, so it can't be guessed. For real Aadhaar cards, a private store with short-lived links would be safer.

## Problems already on `main`, not changed here

- **`RESEND_API_KEY`:** `lib/email.ts` creates the Resend client when the module loads. Without the key, every server action in the app fails to load.
- **Folder-name casing:** the folder is `src/Components`, but imports use `@/components`. Windows doesn't care, but Linux builds can fail.
- **Text colour:** `globals.css` fixes body text at `#333`, while daisyUI follows the OS dark mode. These pages set `data-theme="light"` to stay readable.
- **No favicon:** every page requests `favicon.ico` and gets a 404.
- **Lockfile:** `npm install` with npm 11 rewrites `package-lock.json` (the same diff appears on `feat/blob-uploads`).
