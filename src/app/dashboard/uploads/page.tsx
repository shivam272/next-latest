"use client";

import { upload } from "@vercel/blob/client";
import { useEffect, useState, type FormEvent } from "react";
import type { UploadedFile, UploadSubmission } from "@/models/upload";

const fields = [
  { name: "image", label: "Image", accept: "image/*", multiple: false },
  { name: "single", label: "Single file", accept: undefined, multiple: false },
  { name: "multiple", label: "Multiple files", accept: undefined, multiple: true },
] as const;

type Selections = Record<(typeof fields)[number]["name"], File[]>;
type SavedSubmission = UploadSubmission & { _id: string };
type PreviewFile = Pick<UploadedFile, "url" | "filename" | "contentType">;

function FilePreview({ file }: { file: PreviewFile }) {
  return (
    <div className="space-y-2 rounded border border-base-300 p-3">
      {file.contentType.startsWith("image/") && (
        // Native previews use the file URL and its browser cache directly.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={file.url}
          alt={file.filename}
          className="h-36 w-full object-contain"
        />
      )}
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="link break-all"
      >
        {file.filename}
      </a>
    </div>
  );
}

export default function UploadsPage() {
  const [selections, setSelections] = useState<Selections>({
    image: [],
    single: [],
    multiple: [],
  });
  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const [submissions, setSubmissions] = useState<SavedSubmission[]>([]);
  const [message, setMessage] = useState("Loading saved uploads...");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const files = Object.values(selections).flat().map((file) => ({
      url: URL.createObjectURL(file),
      filename: file.name,
      contentType: file.type,
    }));
    setPreviews(files);
    return () => files.forEach((file) => URL.revokeObjectURL(file.url));
  }, [selections]);

  useEffect(() => {
    async function loadSubmissions() {
      try {
        const response = await fetch("/api/dashboard/uploads");
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setSubmissions(data);
        setMessage("");
      } catch {
        setMessage("Could not load saved uploads.");
      }
    }
    void loadSubmissions();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const title = String(new FormData(form).get("title")).trim();
    const selectedFiles = Object.values(selections).flat();
    if (!selectedFiles.length) {
      setMessage("Select at least one file.");
      return;
    }

    setIsSubmitting(true);
    setMessage("Uploading...");
    try {
      const files = await Promise.all(
        selectedFiles.map(async (file) => {
          const blob = await upload(`dummy/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/blob/upload",
          });
          return {
            url: blob.url,
            pathname: blob.pathname,
            filename: file.name,
            contentType: blob.contentType,
            size: file.size,
          };
        }),
      );

      const response = await fetch("/api/dashboard/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, files }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSubmissions((current) => [data, ...current]);
      form.reset();
      setSelections({ image: [], single: [], multiple: [] });
      setMessage("Files uploaded and URLs saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Upload demo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset disabled={isSubmitting} className="space-y-4">
          <label className="block space-y-1">
            <span>Title</span>
            <input
              name="title"
              required
              className="input input-bordered w-full"
            />
          </label>
          {fields.map((field) => (
            <label key={field.name} className="block space-y-1">
              <span>{field.label}</span>
              <input
                type="file"
                accept={field.accept}
                multiple={field.multiple}
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);
                  setSelections((current) => ({ ...current, [field.name]: files }));
                }}
                className="file-input file-input-bordered w-full"
              />
            </label>
          ))}
          <div className="grid gap-3 sm:grid-cols-2">
            {previews.map((file) => (
              <FilePreview key={file.url} file={file} />
            ))}
          </div>
          <button type="submit" className="btn btn-primary">
            {isSubmitting ? "Uploading..." : "Upload and save"}
          </button>
        </fieldset>
      </form>
      <p role="status">{message}</p>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Saved uploads</h2>
        {submissions.map((submission) => (
          <article
            key={submission._id}
            className="space-y-3 rounded border border-base-300 p-4"
          >
            <h3 className="font-semibold">{submission.title}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {submission.files.map((file) => (
                <FilePreview key={file.url} file={file} />
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
