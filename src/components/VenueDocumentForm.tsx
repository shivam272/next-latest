"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  venueDocumentClientSchema,
  type IVenueDocumentClientInput,
} from "@/schema/venueDocumentSchema";
import { toast } from "react-toastify";

export const VenueDocumentForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IVenueDocumentClientInput>({
    resolver: zodResolver(venueDocumentClientSchema),
    mode: "onTouched",
  });

  const onSubmitHandler = async (data: IVenueDocumentClientInput) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", data.image[0]);
    formData.append("adhaar", data.adhaar[0]);
    Array.from(data.qualification).forEach((file) => {
      formData.append("qualification", file);
    });

    const res = await fetch("/api/venue-documents", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      toast.success("Submitted successfully!");
      reset();
    } else {
      toast.error(result.message || "Submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="mx-auto w-full max-w-2xl space-y-6"
        noValidate
      >
        <div className="text-center">
          <div className="text-3xl font-bold">Document Submission</div>
          <p className="mt-1 text-base-content/60">Upload your verified documents</p>
        </div>

        <div className="card bg-white shadow-md p-6 space-y-4">
          <div>
            <label htmlFor="name" className="label">
              <span className="label-text font-medium">Name</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              {...register("name")}
              className={`input input-bordered w-full focus:outline-none ${errors.name ? "input-error" : ""}`}
            />
            {errors.name && <span className="text-xs text-error mt-1 block">{errors.name.message}</span>}
          </div>

          <div>
            <label htmlFor="image" className="label">
              <span className="label-text font-medium">Profile Image (JPEG, JPG, PDF &le; 1MB)</span>
            </label>
            <input
              type="file"
              id="image"
              accept=".jpeg,.jpg,.pdf"
              {...register("image")}
              className={`file-input file-input-bordered w-full focus:outline-none ${errors.image ? "file-input-error" : ""}`}
            />
            {errors.image && <span className="text-xs text-error mt-1 block">{errors.image.message as string}</span>}
          </div>

          <div>
            <label htmlFor="adhaar" className="label">
              <span className="label-text font-medium">Aadhar Card (PDF &le; 1MB)</span>
            </label>
            <input
              type="file"
              id="adhaar"
              accept=".pdf"
              {...register("adhaar")}
              className={`file-input file-input-bordered w-full focus:outline-none ${errors.adhaar ? "file-input-error" : ""}`}
            />
            {errors.adhaar && <span className="text-xs text-error mt-1 block">{errors.adhaar.message as string}</span>}
          </div>

          <div>
            <label htmlFor="qualification" className="label">
              <span className="label-text font-medium">Qualification Documents (Multiple PDFs &le; 1MB each)</span>
            </label>
            <input
              multiple
              type="file"
              id="qualification"
              accept=".pdf"
              {...register("qualification")}
              className={`file-input file-input-bordered w-full focus:outline-none ${errors.qualification ? "file-input-error" : ""}`}
            />
            {errors.qualification && (
              <span className="text-xs text-error mt-1 block">{errors.qualification.message as string}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full mt-4"
          >
            {isSubmitting ? "Uploading..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};
