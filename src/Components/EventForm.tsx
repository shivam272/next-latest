"use client";
import { useForm, useFieldArray, type FieldErrors } from "react-hook-form";
import { type IEventInput } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/schema";
import { toast } from "react-toastify";

export const EventForm = () => {
  const {
    control,
    reset,
    trigger,
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<Omit<IEventInput, "venueId">>({
    defaultValues: {
      name: "",
      description: "",
      date: "",
      time: "",
      organizer: "",
      artist: "",
      capacity: "",
      price: "",
      ageRestriction: "",
      duration: "",
      addOns: [
        {
          name: "",
        },
      ],
    },
    resolver: zodResolver(eventSchema),
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addOns",
  });

  const onSubmitHandler = async (data: Omit<IEventInput, "venueId">) => {
    console.log("Event Data:", data);
    // const res = await fetch("/api/dashboard/create-event", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });

    // const content = await res.json();

    // if (content.status <= 201) {
    //   toast.success(content.message);
    //   reset();
    // } else {
    //   toast.error(content.message);
    // }
  };

  const getErrors = () => {
    trigger();
    console.log("Form Errors:", errors);
  };

  const onErrorHandler = (
    errors: FieldErrors<Omit<IEventInput, "venueId">>,
  ) => {
    // if there is a issue in the form, show a toast notification
    toast.error("Please fix the errors in the form");
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
          <div className="text-3xl font-bold">Create Event</div>
          <p className="mt-1 text-base-content/60">
            Add the details of your event.
          </p>
        </div>
        {/* Event Information */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            {/* Event Name */}
            <div>
              <label htmlFor="name" className="label">
                <span className="label-text font-medium">Event Name</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter event name"
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
            {/* Description */}
            <div className=" mt-2">
              <label htmlFor="description" className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                id="description"
                placeholder="Enter event description"
                {...register("description")}
                className={`textarea textarea-bordered h-24 w-full focus:outline-none  ${
                  errors.description ? "textarea-error" : ""
                }`}
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.description.message}
                  </span>
                </label>
              )}
            </div>
            {/* Date & Time */}
            <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Date */}
              <div className="">
                <label htmlFor="date" className="label">
                  <span className="label-text font-medium">Date</span>
                </label>
                <input
                  type="date"
                  id="date"
                  placeholder="Enter event date"
                  {...register("date")}
                  className={`input input-bordered w-full focus:outline-none focus-within:outline-none ${
                    errors.date ? "input-error" : ""
                  }`}
                />
                {errors.date && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.date.message}
                    </span>
                  </label>
                )}
              </div>
              {/* Time */}
              <div className="">
                <label htmlFor="time" className="label">
                  <span className="label-text font-medium">Time</span>
                </label>
                <input
                  type="time"
                  id="time"
                  placeholder="Enter event time"
                  {...register("time")}
                  className={`input input-bordered w-full focus:outline-none focus-within:outline-none  ${
                    errors.time ? "input-error" : ""
                  }`}
                />
                {errors.time && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.time.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
            {/* Organizer & artist */}
            <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Organizer */}
              <div className="">
                <label htmlFor="organizer" className="label">
                  <span className="label-text font-medium">Organizer</span>
                </label>
                <input
                  type="text"
                  id="organizer"
                  placeholder="Enter organizer name"
                  {...register("organizer")}
                  className={`input input-bordered w-full focus:outline-none  ${
                    errors.organizer ? "input-error" : ""
                  }`}
                />
                {errors.organizer && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.organizer.message}
                    </span>
                  </label>
                )}
              </div>
              {/* Category */}
              <div className="">
                <label htmlFor="artist" className="label">
                  <span className="label-text font-medium">Artist</span>
                </label>
                <input
                  type="text"
                  id="artist"
                  placeholder="Enter artist name"
                  {...register("artist")}
                  className={`input input-bordered w-full focus:outline-none ${
                    errors.artist ? "input-error" : ""
                  }`}
                />
                {errors.artist && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.artist.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
            {/* Capacity & price*/}
            <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Capacity */}
              <div className="">
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
              {/* Price */}
              <div className="">
                <label htmlFor="price" className="label">
                  <span className="label-text font-medium">Price</span>
                </label>
                <input
                  type="text"
                  id="price"
                  placeholder="Enter ticket price"
                  {...register("price")}
                  className={`input input-bordered w-full focus:outline-none ${
                    errors.price ? "input-error" : ""
                  }`}
                />
                {errors.price && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.price.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
            {/* Age Restriction & Duration */}
            <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Age Restriction */}
              <div className="">
                <label htmlFor="ageRestriction" className="label">
                  <span className="label-text font-medium">
                    Age Restriction
                  </span>
                </label>
                <input
                  type="text"
                  id="ageRestriction"
                  placeholder="Enter age restriction"
                  {...register("ageRestriction")}
                  className={`input input-bordered w-full focus:outline-none ${
                    errors.ageRestriction ? "input-error" : ""
                  }`}
                />
                {errors.ageRestriction && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.ageRestriction.message}
                    </span>
                  </label>
                )}
              </div>
              {/* Duration */}
              <div className="">
                <label htmlFor="duration" className="label">
                  <span className="label-text font-medium">
                    Duration (mins)
                  </span>
                </label>
                <input
                  type="text"
                  id="duration"
                  placeholder="Enter event duration in mins"
                  {...register("duration")}
                  className={`input input-bordered w-full focus:outline-none ${
                    errors.duration ? "input-error" : ""
                  }`}
                />
                {errors.duration && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.duration.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
            {/* Add-ons */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title">AddOns</h2>
                <p className="text-sm text-base-content/60">
                  Add-ons available for this event.
                </p>
              </div>
              <button
                type="button"
                onClick={() => append({ name: "" })}
                className="btn btn-primary btn-md"
              >
                Add Add-on
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              {fields.map((field, index) => (
                <div key={field.id}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Add-on ${index + 1}`}
                      {...register(`addOns.${index}.name`)}
                      className={`input input-bordered w-full focus:outline-none${
                        errors.addOns?.[index]?.name ? "input-error" : ""
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
                  {errors.addOns?.[index]?.name && (
                    <p className="mt-1 text-sm text-error">
                      {errors.addOns[index].name.message}
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
                Create Event
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
