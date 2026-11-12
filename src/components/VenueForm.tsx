"use client";

import { useForm, useFieldArray, type FieldErrors } from "react-hook-form";
import { type IVenueInput } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { venueClientSchema } from "@/schema";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

const FilePreview = ({ file }: { file: File }) => {
  const url = URL.createObjectURL(file);
  return (
    <div className="mt-2 p-2 bg-base-200 rounded flex items-center justify-between text-xs">
      <span className="truncate max-w-[80%]">📄 {file.name}</span>
      <a href={url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
        Preview
      </a>
    </div>
  );
};

export const VenueForm = () => {
  const {
    control,
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IVenueInput>({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      capacity: "",
      amenities: [{ name: "" }],
    },
    resolver: zodResolver(venueClientSchema),
    mode: "onTouched",
  });

  const imageFiles = watch("image");
  const adhaarFiles = watch("adhaarCard");
  const qualFiles = watch("qualification");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "amenities",
  });

  const onSubmitHandler = async (data: IVenueInput) => {
    const formData = new FormData();
    const { adhaarCard, image, qualification, ...venueData } = data;
    formData.append("venueData", JSON.stringify(venueData));

    if (image?.[0]) {
      formData.append("image", image[0]);
    }
    if (adhaarCard?.[0]) {
      formData.append("adhaarCard", adhaarCard[0]);
    }
    if (qualification?.length) {
      Array.from(qualification).forEach((file) => {
        formData.append("qualification", file);
      });
    }

    const res = await fetch("/api/dashboard/create-venue", {
      method: "POST",
      body: formData,
    });

    const content = await res.json();

    if (content.status <= 201) {
      toast.success(content.message);
      reset();
      redirect("/dashboard");
    } else {
      toast.error(content.message);
    }
  };

  const onErrorHandler = (errors: FieldErrors<IVenueInput>) => {
    toast.error("Please fix the errors in the form");
    console.log("Form errors:", errors);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <form
        className="mx-auto w-full max-w-2xl space-y-6"
        onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}
        noValidate
      >
        <div className="text-center">
          <div className="text-3xl font-bold">Create Venue</div>
          <p className="mt-1 text-base-content/60">Add the details of your venue.</p>
        </div>

        <div className="card bg-white shadow-md p-6 space-y-4" data-theme="light">
          <div>
            <label htmlFor="name" className="label">
              <span className="label-text font-medium">Venue Name</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter venue name"
              {...register("name")}
              className={`input input-bordered w-full focus:outline-none ${errors.name ? "input-error" : ""}`}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name.message}</span>
              </label>
            )}
          </div>

          <div>
            <label htmlFor="address" className="label">
              <span className="label-text font-medium">Address</span>
            </label>
            <textarea
              id="address"
              placeholder="Enter complete venue address"
              {...register("address")}
              className={`textarea textarea-bordered h-24 w-full focus:outline-none ${errors.address ? "textarea-error" : ""}`}
            />
            {errors.address && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.address.message}</span>
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="city" className="label">
                <span className="label-text font-medium">City</span>
              </label>
              <input
                type="text"
                id="city"
                placeholder="Enter city"
                {...register("city")}
                className={`input input-bordered w-full focus:outline-none ${errors.city ? "input-error" : ""}`}
              />
              {errors.city && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.city.message}</span>
                </label>
              )}
            </div>

            <div>
              <label htmlFor="state" className="label">
                <span className="label-text font-medium">State</span>
              </label>
              <input
                type="text"
                id="state"
                placeholder="Enter state"
                {...register("state")}
                className={`input input-bordered w-full focus:outline-none ${errors.state ? "input-error" : ""}`}
              />
              {errors.state && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.state.message}</span>
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="zipCode" className="label">
                <span className="label-text font-medium">ZIP Code</span>
              </label>
              <input
                type="text"
                id="zipCode"
                placeholder="Enter ZIP code"
                {...register("zipCode")}
                className={`input input-bordered w-full focus:outline-none ${errors.zipCode ? "input-error" : ""}`}
              />
              {errors.zipCode && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.zipCode.message}</span>
                </label>
              )}
            </div>

            <div>
              <label htmlFor="country" className="label">
                <span className="label-text font-medium">Country</span>
              </label>
              <input
                type="text"
                id="country"
                placeholder="Enter country"
                {...register("country")}
                className={`input input-bordered w-full focus:outline-none ${errors.country ? "input-error" : ""}`}
              />
              {errors.country && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.country.message}</span>
                </label>
              )}
            </div>
          </div>

          {/* Document Verification Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Document Verification</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="image" className="label">
                  <span className="label-text font-medium">Profile Image</span>
                  <span className="text-xs text-base-content/60">(JPEG, JPG, PDF &le; 1MB)</span>
                </label>
                <input
                  type="file"
                  id="image"
                  accept=".jpeg,.jpg,.pdf"
                  {...register("image")}
                  className="file-input file-input-bordered w-full focus:outline-none"
                />
                {imageFiles?.[0] && <FilePreview file={imageFiles[0]} />}
                {errors.image && (
                  <span className="text-xs text-error mt-1 block">{errors.image.message as string}</span>
                )}
              </div>

              <div>
                <label htmlFor="adhaarCard" className="label">
                  <span className="label-text font-medium">Aadhar Card</span>
                  <span className="text-xs text-base-content/60">(PDF &le; 1MB)</span>
                </label>
                <input
                  type="file"
                  id="adhaarCard"
                  accept="application/pdf"
                  {...register("adhaarCard")}
                  className="file-input file-input-bordered w-full focus:outline-none"
                />
                {adhaarFiles?.[0] && <FilePreview file={adhaarFiles[0]} />}
                {errors.adhaarCard && (
                  <span className="text-xs text-error mt-1 block">{errors.adhaarCard.message as string}</span>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="qualification" className="label">
                  <span className="label-text font-medium">Qualification Documents</span>
                  <span className="text-xs text-base-content/60">(Multiple PDFs &le; 1MB each)</span>
                </label>
                <input
                  multiple
                  type="file"
                  id="qualification"
                  accept="application/pdf"
                  {...register("qualification")}
                  className="file-input file-input-bordered w-full focus:outline-none"
                />
                {qualFiles?.length ? (
                  <div className="space-y-1 mt-2">
                    {Array.from(qualFiles).map((file, i) => (
                      <FilePreview key={i} file={file} />
                    ))}
                  </div>
                ) : null}
                {errors.qualification && (
                  <span className="text-xs text-error mt-1 block">{errors.qualification.message as string}</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="capacity" className="label">
              <span className="label-text font-medium">Capacity</span>
            </label>
            <input
              type="text"
              id="capacity"
              placeholder="Enter venue capacity"
              {...register("capacity")}
              className={`input input-bordered w-full focus:outline-none ${errors.capacity ? "input-error" : ""}`}
            />
            {errors.capacity && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.capacity.message}</span>
              </label>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-text font-medium">Amenities</label>
              <button
                type="button"
                onClick={() => append({ name: "" })}
                className="btn btn-sm btn-primary"
              >
                Add Amenity
              </button>
            </div>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Amenity ${index + 1}`}
                    {...register(`amenities.${index}.name` as const)}
                    className="input input-bordered flex-1 focus:outline-none"
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn btn-sm btn-ghost"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full mt-4"
          >
            {isSubmitting ? "Creating Venue..." : "Create Venue"}
          </button>
        </div>
      </form>
    </div>
  );
};
