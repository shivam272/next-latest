import Image from "next/image";
import Link from "next/link";
import { DOCUMENT_PATHS } from "@/constants";
import { type IDocumentProfile } from "@/types";
import { DeleteDocumentProfileButton } from "./DeleteDocumentProfileButton";
import { StoredFileLink } from "./StoredFileLink";

interface IDocumentProfileListProps {
  profiles: IDocumentProfile[];
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const DocumentProfileList = ({
  profiles,
}: IDocumentProfileListProps) => {
  if (profiles.length === 0) {
    return (
      <div className="card bg-base-100 shadow-md">
        <div className="card-body items-center text-center">
          <p className="text-base-content/70">No documents submitted yet.</p>
          <Link href={DOCUMENT_PATHS.create} className="btn btn-primary btn-sm">
            Add documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {profiles.map((profile) => (
        <li key={profile.id} className="card bg-base-100 shadow-md">
          <div className="card-body gap-4 sm:flex-row sm:items-start">
            <Image
              src={profile.image.path}
              alt={`${profile.name} photo`}
              width={80}
              height={80}
              className="h-20 w-20 shrink-0 rounded-lg object-cover"
            />

            <div className="min-w-0 flex-1 space-y-3 text-sm">
              <div>
                <h2 className="text-lg font-semibold">{profile.name}</h2>
                <p className="text-xs text-base-content/60">
                  Updated {dateFormatter.format(new Date(profile.updatedAt))}
                </p>
              </div>
              <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[auto_1fr]">
                <dt className="font-medium">Aadhaar</dt>
                <dd>
                  <StoredFileLink file={profile.adhaar} />
                </dd>
                <dt className="font-medium">
                  Qualification ({profile.qualification.length})
                </dt>
                <dd>
                  <ul className="space-y-1">
                    {profile.qualification.map((file) => (
                      <li key={file.path}>
                        <StoredFileLink file={file} />
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>
            </div>

            <div className="flex shrink-0 gap-2">
              <Link
                href={DOCUMENT_PATHS.edit(profile.id)}
                className="btn btn-outline btn-sm"
              >
                Edit
              </Link>
              <DeleteDocumentProfileButton
                id={profile.id}
                name={profile.name}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
