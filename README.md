This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Upload demo

Open `/dashboard/uploads` or choose **Services → Upload demo**. The form accepts
an image, a single file, and multiple files, with local previews and a saved list
that remains available after reloading.

Set `MONGODB_URI` and `BLOB_READ_WRITE_TOKEN` in `.env.local`. Connect a **public**
Vercel Blob store to the project and configure the same variables for deployment.
Files upload directly from the browser to Blob; MongoDB stores the title and file
URLs/metadata. The form saves the record after uploading, so database saving does
not depend on a Blob completion callback reaching localhost.

The Blob upload token sets `cacheControlMaxAge: 31536000`, which configures the
file's HTTP cache header for one year. Each upload gets a unique URL. Previews use
those URLs directly, so the browser handles caching. PDFs and other files open
through a link; images use native browser previews.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
