import Link from "next/link";
import { DocumentProfileList } from "@/components";
import { DOCUMENT_PATHS } from "@/constants";
import { listDocumentProfiles } from "@/services";

export const dynamic = "force-dynamic"; // always show the latest submissions

const DocumentsPage = async () => {
  const profiles = await listDocumentProfiles();

  return (
    // The app's global text colour is fixed, so pin the light theme here.
    <div data-theme="light" className="bg-transparent px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-base-content/60">
              All submitted forms. Files are stored in Vercel Blob.
            </p>
          </div>
          <Link href={DOCUMENT_PATHS.create} className="btn btn-primary">
            Add documents
          </Link>
        </div>
        <DocumentProfileList profiles={profiles} />
      </div>
    </div>
  );
};

export default DocumentsPage;
