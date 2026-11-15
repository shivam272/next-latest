import { type Types } from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import DocumentProfile from "@/models/documentProfile";
import {
  type IDocumentProfile,
  type IDocumentProfileInput,
  type IStoredFile,
} from "@/types";
import { deleteFromBlobQuietly } from "./blob.service";

interface IDocumentProfileRecord extends IDocumentProfileInput {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const toStoredFile = ({ path, size }: IStoredFile): IStoredFile => ({
  path,
  size,
});

const toDocumentProfile = (
  record: IDocumentProfileRecord,
): IDocumentProfile => ({
  id: record._id.toString(),
  name: record.name,
  image: toStoredFile(record.image),
  adhaar: toStoredFile(record.adhaar),
  qualification: record.qualification.map(toStoredFile),
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

/** Every Blob URL a profile points to. */
const getFilePaths = (profile: IDocumentProfileInput): string[] => [
  profile.image.path,
  profile.adhaar.path,
  ...profile.qualification.map(({ path }) => path),
];

export const createDocumentProfile = async (
  input: IDocumentProfileInput,
): Promise<IDocumentProfile> => {
  await connectToDatabase();
  const created = await DocumentProfile.create(input);
  return toDocumentProfile(created.toObject<IDocumentProfileRecord>());
};

/** All profiles, newest first. Fine for a POC; a real list would paginate. */
export const listDocumentProfiles = async (): Promise<IDocumentProfile[]> => {
  await connectToDatabase();
  const records = await DocumentProfile.find({})
    .sort({ createdAt: -1 })
    .lean<IDocumentProfileRecord[]>()
    .exec();
  return records.map(toDocumentProfile);
};

export const getDocumentProfile = async (
  id: string,
): Promise<IDocumentProfile | null> => {
  await connectToDatabase();
  const record = await DocumentProfile.findById(id)
    .lean<IDocumentProfileRecord>()
    .exec();
  return record ? toDocumentProfile(record) : null;
};

/**
 * Replaces the profile's fields, then deletes the files it no longer uses.
 * Returns null when the profile does not exist.
 */
export const updateDocumentProfile = async (
  id: string,
  input: IDocumentProfileInput,
): Promise<IDocumentProfile | null> => {
  await connectToDatabase();
  // Returns the document as it was before the update, to find dropped files.
  const previous = await DocumentProfile.findByIdAndUpdate(
    id,
    { $set: input },
    { runValidators: true },
  )
    .lean<IDocumentProfileRecord>()
    .exec();
  if (!previous) {
    return null;
  }

  const keptPaths = new Set(getFilePaths(input));
  await deleteFromBlobQuietly(
    getFilePaths(previous).filter((path) => !keptPaths.has(path)),
  );
  return getDocumentProfile(id);
};

/** Deletes the profile and its files. Returns false when it does not exist. */
export const deleteDocumentProfile = async (id: string): Promise<boolean> => {
  await connectToDatabase();
  const deleted = await DocumentProfile.findByIdAndDelete(id)
    .lean<IDocumentProfileRecord>()
    .exec();
  if (!deleted) {
    return false;
  }
  await deleteFromBlobQuietly(getFilePaths(deleted));
  return true;
};

/**
 * Deletes uploaded files that no saved profile uses, for example when a form
 * fails after some of its files were uploaded. Files in use are never touched.
 */
export const deleteUnusedFiles = async (paths: string[]): Promise<void> => {
  if (paths.length === 0) {
    return;
  }
  await connectToDatabase();
  const inUse = await DocumentProfile.find({
    $or: [
      { "image.path": { $in: paths } },
      { "adhaar.path": { $in: paths } },
      { "qualification.path": { $in: paths } },
    ],
  })
    .lean<IDocumentProfileRecord[]>()
    .exec();
  const usedPaths = new Set(inUse.flatMap(getFilePaths));
  await deleteFromBlobQuietly(paths.filter((path) => !usedPaths.has(path)));
};
