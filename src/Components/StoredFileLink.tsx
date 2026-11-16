import { type IStoredFile } from "@/types";
import { formatFileSize, getFileNameFromPath } from "@/utils/file.utils";

interface IStoredFileLinkProps {
  file: IStoredFile;
}

/** A stored file as "name.pdf · 54 KB", opening in a new tab. */
export const StoredFileLink = ({
  file: { path, size },
}: IStoredFileLinkProps) => (
  <span>
    <a
      href={path}
      target="_blank"
      rel="noreferrer"
      className="link link-primary break-all"
    >
      {getFileNameFromPath(path)}
    </a>
    <span className="text-base-content/60"> · {formatFileSize(size)}</span>
  </span>
);
