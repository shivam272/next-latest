import { type IStoredFile } from "@/types";
import { formatFileSize, getFileNameFromPath } from "@/utils/file.utils";

interface IStoredFileLinkProps {
  file: IStoredFile;
}

/** A stored file as "name.pdf · 54 KB", opening in a new tab. */
export const StoredFileLink = ({ file }: IStoredFileLinkProps) => (
  <span>
    <a
      href={file.path}
      target="_blank"
      rel="noreferrer"
      className="link link-primary break-all"
    >
      {getFileNameFromPath(file.path)}
    </a>
    <span className="text-base-content/60"> · {formatFileSize(file.size)}</span>
  </span>
);
