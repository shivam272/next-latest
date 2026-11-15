"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  createDocumentProfileAction,
  discardUploadedFilesAction,
  updateDocumentProfileAction,
  uploadDocumentFileAction,
} from "@/actions/documentProfile.action";
import { DOCUMENT_PATHS } from "@/constants";
import {
  DOCUMENT_LIMITS,
  FILE_INPUT_ACCEPT,
  documentProfileClientSchema,
} from "@/schema";
import {
  EDocumentField,
  type IDocumentProfile,
  type IDocumentProfileFormValues,
  type IStoredFile,
} from "@/types";
import { formatFileSize } from "@/utils/file.utils";
import { StoredFileLink } from "./StoredFileLink";

interface IDocumentProfileFormProps {
  /** The saved profile when editing; absent when creating. */
  profile?: IDocumentProfile;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="mt-1 text-sm text-error" role="alert">
      {message}
    </p>
  ) : null;

const countNewFiles = ({
  image,
  adhaar,
  qualification,
}: IDocumentProfileFormValues): number =>
  (image?.length ?? 0) + (adhaar?.length ?? 0) + (qualification?.length ?? 0);

export const DocumentProfileForm = ({ profile }: IDocumentProfileFormProps) => {
  const router = useRouter();
  const isEdit = Boolean(profile);
  const [status, setStatus] = useState("");

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IDocumentProfileFormValues>({
    defaultValues: {
      name: profile?.name ?? "",
      keptQualification: profile?.qualification ?? [],
    },
    resolver: zodResolver(documentProfileClientSchema(isEdit)),
    mode: "onTouched",
  });

  const { fields: keptQualification, remove: removeKeptQualification } =
    useFieldArray({ control, name: "keptQualification" });
  const newQualificationFiles = Array.from(watch("qualification") ?? []);

  /**
   * Submit: each new file goes to the server on its own (where Zod checks it
   * and it is stored in Vercel Blob), then the server checks the whole form
   * with Zod and saves the paths. If any step fails, the files this attempt
   * uploaded are deleted again.
   */
  const onSubmit = async (values: IDocumentProfileFormValues) => {
    const totalFiles = countNewFiles(values);
    const uploadedPaths: string[] = [];

    const upload = async (
      field: EDocumentField,
      file: File,
    ): Promise<IStoredFile> => {
      setStatus(`Uploading file ${uploadedPaths.length + 1} of ${totalFiles}…`);
      const formData = new FormData();
      formData.append("field", field);
      formData.append("file", file);

      const result = await uploadDocumentFileAction(formData);
      if (!result.success || !result.data) {
        throw new Error(result.message);
      }
      uploadedPaths.push(result.data.path);
      return result.data;
    };

    /** Uploads the chosen file, or keeps the stored one when editing. */
    const uploadOrKeep = async (
      field: EDocumentField,
      files: FileList | undefined,
      stored: IStoredFile | undefined,
    ): Promise<IStoredFile> => {
      const file = files?.[0];
      if (file) {
        return upload(field, file);
      }
      if (!stored) {
        throw new Error("Please choose all the required files");
      }
      return stored;
    };

    try {
      const image = await uploadOrKeep(
        EDocumentField.IMAGE,
        values.image,
        profile?.image,
      );
      const adhaar = await uploadOrKeep(
        EDocumentField.ADHAAR,
        values.adhaar,
        profile?.adhaar,
      );
      const newQualification: IStoredFile[] = [];
      for (const file of Array.from(values.qualification ?? [])) {
        newQualification.push(await upload(EDocumentField.QUALIFICATION, file));
      }

      setStatus("Saving…");
      const input = {
        name: values.name,
        image,
        adhaar,
        qualification: [...values.keptQualification, ...newQualification],
      };
      const result = profile
        ? await updateDocumentProfileAction(profile.id, input)
        : await createDocumentProfileAction(input);
      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);
      router.push(DOCUMENT_PATHS.list);
      router.refresh();
    } catch (error) {
      await discardUploadedFilesAction(uploadedPaths);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setStatus("");
    }
  };

  const onInvalid = () => toast.error("Please fix the errors in the form");
  const keepHint = isEdit ? "Leave empty to keep the current file. " : "";

  return (
    // The app's global text colour is fixed, so pin the light theme here.
    <div data-theme="light" className="bg-transparent px-4 py-8">
      <form
        className="mx-auto w-full max-w-2xl space-y-6"
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit documents" : "Add documents"}
          </h1>
          <p className="mt-1 text-base-content/60">
            Each file can be up to 1 MB.
          </p>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body space-y-4">
            <div>
              <label htmlFor="name" className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter full name"
                {...register("name")}
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div>
              <label htmlFor="image" className="label">
                <span className="label-text font-medium">Image (JPEG/JPG)</span>
              </label>
              {profile && (
                <div className="mb-2 flex items-center gap-3">
                  <Image
                    src={profile.image.path}
                    alt={`${profile.name} photo`}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded object-cover"
                  />
                  <span className="text-sm text-base-content/70">
                    Current image · {formatFileSize(profile.image.size)}
                  </span>
                </div>
              )}
              <input
                id="image"
                type="file"
                accept={FILE_INPUT_ACCEPT[EDocumentField.IMAGE]}
                {...register("image")}
                className={`file-input file-input-bordered w-full ${
                  errors.image ? "file-input-error" : ""
                }`}
              />
              <p className="mt-1 text-xs text-base-content/60">
                {keepHint}One picture, JPEG or JPG.
              </p>
              <FieldError message={errors.image?.message} />
            </div>

            <div>
              <label htmlFor="adhaar" className="label">
                <span className="label-text font-medium">Aadhaar (PDF)</span>
              </label>
              {profile && (
                <p className="mb-2 text-sm">
                  Current: <StoredFileLink file={profile.adhaar} />
                </p>
              )}
              <input
                id="adhaar"
                type="file"
                accept={FILE_INPUT_ACCEPT[EDocumentField.ADHAAR]}
                {...register("adhaar")}
                className={`file-input file-input-bordered w-full ${
                  errors.adhaar ? "file-input-error" : ""
                }`}
              />
              <p className="mt-1 text-xs text-base-content/60">
                {keepHint}One PDF.
              </p>
              <FieldError message={errors.adhaar?.message} />
            </div>

            <div>
              <label htmlFor="qualification" className="label">
                <span className="label-text font-medium">
                  Qualification (PDF, up to{" "}
                  {DOCUMENT_LIMITS.maxQualificationFiles})
                </span>
              </label>
              {keptQualification.length > 0 && (
                <ul className="mb-2 space-y-1">
                  {keptQualification.map((file, index) => (
                    <li
                      key={file.id}
                      className="flex items-center justify-between gap-2 rounded bg-base-200 px-3 py-2 text-sm"
                    >
                      <StoredFileLink file={file} />
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => removeKeptQualification(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <input
                id="qualification"
                type="file"
                multiple
                accept={FILE_INPUT_ACCEPT[EDocumentField.QUALIFICATION]}
                {...register("qualification")}
                className={`file-input file-input-bordered w-full ${
                  errors.qualification ? "file-input-error" : ""
                }`}
              />
              {newQualificationFiles.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-base-content/70">
                  {newQualificationFiles.map((file) => (
                    <li key={`${file.name}-${file.size}`}>
                      New: {file.name} · {formatFileSize(file.size)}
                    </li>
                  ))}
                </ul>
              )}
              <FieldError message={errors.qualification?.message} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {status && (
            <span className="text-sm text-base-content/70">{status}</span>
          )}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => router.push(DOCUMENT_PATHS.list)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting && <span className="loading loading-spinner" />}
            {isEdit ? "Save changes" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};
