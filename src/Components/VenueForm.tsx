"use client";
import { useForm, useFieldArray, type FieldErrors } from "react-hook-form";
import { type IVenueInput } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { venueSchema } from "@/schema";
import { toast } from "react-toastify";

export const VenueForm = () => {
  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<IVenueInput>({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      capacity: "",
      amenities: [
        {
          name: "",
        },
      ],
    },
    resolver: zodResolver(venueSchema),
    mode: "onTouched",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "amenities",
  });

  const onSubmitHandler = async (data: IVenueInput) => {
    const res = await fetch("/api/dashboard/create-venue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const content = await res.json();

    if (content.status <= 201) {
      toast.success(content.message);
      reset();
    } else {
      toast.error(content.message);
    }
  };

  const onErrorHandler = (errors: FieldErrors<IVenueInput>) => {
    // if there is a issue in the form, show a toast notification
    toast.error("Please fix the errors in the form");
  };

  const getAllVenues = async () => {
    try {
      const res = await fetch("/api/dashboard/create-venue");
      const { data, status, message } = await res.json();
      if (status === 200) {
        console.log("Venues fetched:", data);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Error fetching venues");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8">
      <form
        className="mx-auto w-full max-w-3xl space-y-6"
        onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}
        noValidate
      >
        {/* Header */}
        <div className="text-center">
          <div className="text-3xl font-bold">Create Venue</div>
          <p className="mt-1 text-base-content/60">
            Add the details of your venue.
          </p>
        </div>
        {/* Venue Information */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            {/* Venue Name */}
            <div>
              <label htmlFor="name" className="label">
                <span className="label-text font-medium">Venue Name</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter venue name"
                {...register("name")}
                className={`input input-bordered w-full focus:outline-none ${
                  errors.name ? "input-error" : ""
                }`}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </label>
              )}
            </div>
            {/* Address */}
            <div className=" mt-2">
              <label htmlFor="address" className="label">
                <span className="label-text font-medium">Address</span>
              </label>
              <textarea
                id="address"
                placeholder="Enter complete venue address"
                {...register("address")}
                className={`textarea textarea-bordered h-24 w-full focus:outline-none  ${
                  errors.address ? "textarea-error" : ""
                }`}
              />
              {errors.address && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.address.message}
                  </span>
                </label>
              )}
            </div>
            {/* City & State */}
            <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* City */}
              <div className="">
                <label htmlFor="city" className="label">
                  <span className="label-text font-medium">City</span>
                </label>
                <input
                  type="text"
                  id="city"
                  placeholder="Enter city"
                  {...register("city")}
                  className={`input input-bordered w-full focus:outline-none ${
                    errors.city ? "input-error" : ""
                  }`}
                />
                {errors.city && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.city.message}
                    </span>
                  </label>
                )}
              </div>
              {/* State */}
              <div className="">
                <label htmlFor="state" className="label">
                  <span className="label-text font-medium">State</span>
                </label>
                <input
                  type="text"
                  id="state"
                  placeholder="Enter state"
                  {...register("state")}
                  className={`input input-bordered w-full focus:outline-none  ${
                    errors.state ? "input-error" : ""
                  }`}
                />
                {errors.state && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.state.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
            {/* ZIP & Country */}
            <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* ZIP Code */}
              <div className="">
                <label htmlFor="zipCode" className="label">
                  <span className="label-text font-medium">ZIP Code</span>
                </label>
                <input
                  type="text"
                  id="zipCode"
                  placeholder="Enter ZIP code"
                  {...register("zipCode")}
                  className={`input input-bordered w-full focus:outline-none  ${
                    errors.state ? "input-error" : ""
                  }`}
                />
                {errors.zipCode && (
                  <label className="label">
                    <span className="label-text-alt text-error fo">
                      {errors.zipCode.message}
                    </span>
                  </label>
                )}
              </div>
              {/* Country */}
              <div className="">
                <label htmlFor="country" className="label">
                  <span className="label-text font-medium">Country</span>
                </label>
                <input
                  type="text"
                  id="country"
                  placeholder="Enter country"
                  {...register("country")}
                  className={`input input-bordered w-full focus:outline-none ${
                    errors.country ? "input-error" : ""
                  }`}
                />
                {errors.country && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.country.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
            {/* Capacity */}
            <div className=" mt-2">
              <label htmlFor="capacity" className="label">
                <span className="label-text font-medium">Capacity</span>
              </label>
              <input
                type="text"
                id="capacity"
                placeholder="Enter venue capacity"
                {...register("capacity")}
                className={`input input-bordered w-full focus:outline-none ${
                  errors.capacity ? "input-error" : ""
                }`}
              />
              {errors.capacity && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.capacity.message}
                  </span>
                </label>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title">Amenities</h2>
                <p className="text-sm text-base-content/60">
                  Add facilities available at this venue.
                </p>
              </div>
              <button
                type="button"
                onClick={() => append({ name: "" })}
                className="btn btn-primary btn-md"
              >
                Add Amenity
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              {fields.map((field, index) => (
                <div key={field.id}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Amenity ${index + 1}`}
                      {...register(`amenities.${index}.name`)}
                      className={`input input-bordered w-full focus:outline-none${
                        errors.amenities?.[index]?.name ? "input-error" : ""
                      }`}
                    />
                    <button
                      type="button"
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                      className="btn btn-error btn-outline"
                    >
                      Remove
                    </button>
                  </div>
                  {errors.amenities?.[index]?.name && (
                    <p className="mt-1 text-sm text-error">
                      {errors.amenities[index].name.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                disabled={!isDirty}
                type="button"
                onClick={() => reset()}
                className="btn btn-outline"
              >
                Reset
              </button>
              <button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="btn btn-primary"
              >
                Create Venue
              </button>
              <button
                onClick={getAllVenues}
                // disabled={!isValid || isSubmitting}
                type="button"
                className="btn btn-primary"
              >
                Get All Venues
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
