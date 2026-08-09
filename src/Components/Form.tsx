"use client";

import { useForm, useFieldArray, type FieldErrors } from "react-hook-form";
import { type IFormInput } from "@/types";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { signOut } from "@/actions/server";

export const FormComp = () => {
  const {
    control,
    reset,
    trigger,
    watch,
    register,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields, isDirty },
  } = useForm<IFormInput>({
    defaultValues: {
      terms: true,
      phone: ["", ""],
      cities: [
        {
          name: "",
        },
      ],
    },
    mode: "onTouched",
  });

  const sessionData = useSession();

  const router = useRouter();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cities",
  });

  const onSubmitHandler = async (data: IFormInput) => {
    const res = await fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const content = await res.json();

    console.log(content);

    if (content.status <= 201) {
      toast.success(content.message);
    } else {
      toast.error(content.message);
    }
  };

  const onErrorHandler = (errors: FieldErrors<IFormInput>) => {
    // it will trigger if form has an error
    console.log(errors);
  };

  const dummyApiTrigger = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users/1");

    const content = await res.json();

    console.log(content);
  };

  const signOutHandler = async () => {
    const response = await signOut();
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);
    router.push("/signIn");
  };

  const getLogsAndSession = () => {
    console.log(touchedFields, dirtyFields, sessionData);
  };

  const currentPassword = watch("password");
  const currentTerms = watch("terms");
  const [primaryPhone] = watch("phone");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="w-full max-w-xl bg-white p-8 rounded-xl shadow-md space-y-5"
        onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}
        noValidate
      >
        {/* name */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              {...register("firstName", { required: "First name is required" })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* lastname */}
          <div className="w-1/2">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              {...register("lastName", {
                required: "Last name is required",
                validate: {
                  last: (val) => {
                    if (val === "last") {
                      return "the field is can't be last";
                    }
                  },
                  bad: (val) => {
                    if (val === "bad") {
                      return "the field is can't be bad";
                    }
                  },
                },
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* email  */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* cities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Cities
          </label>
          <div className="flex flex-col gap-4">
            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      {...register(`cities.${index}.name`, {
                        required: "City is a required field",
                      })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      disabled={fields.length === 1}
                      type="button"
                      onClick={() => remove(index)}
                      className="rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors p-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                  {errors.cities?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.cities[index].name.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => append({ name: "" })}
            className="w-1/2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors p-2 mt-4"
          >
            Add
          </button>
        </div>

        {/* Password & Confirm Password Side-by-Side (Optional example) */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 3,
                  message: "Password must be at least 3 characters",
                },
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="w-1/2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === currentPassword || "Passwords do not match",
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Primary Phone & Secondary Phone Side-by-Side */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label
              htmlFor="primaryPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Primary Phone
            </label>
            <input
              type="tel"
              id="primaryPhone"
              placeholder="9876543210"
              {...register("phone.0", {
                required: "Primary phone is required",
                pattern: {
                  value: /^[0-9]\d{2}$/,
                  message: "Enter a valid 10-digit mobile number",
                },
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.phone?.[0] && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone?.[0].message}
              </p>
            )}
          </div>

          <div className="w-1/2">
            <label
              htmlFor="secondaryPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Secondary Phone
            </label>
            <input
              type="tel"
              id="secondaryPhone"
              placeholder="9876543210"
              {...register("phone.1", {
                pattern: {
                  value: /^[0-9]\d{2}$/,
                  message: "Enter a valid 10-digit mobile number",
                },
                validate: (value) =>
                  !value ||
                  value !== primaryPhone ||
                  "Secondary phone cannot be the same as primary phone",
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.phone?.[1] && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone?.[1].message}
              </p>
            )}
          </div>
        </div>

        {/* Gender Selection & age */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Choose a Gender
            </label>
            <select
              id="gender"
              {...register("gender")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="w-1/2">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              placeholder="type your age"
              {...register("age", {
                required: "Age is required",
                valueAsNumber: true,
                validate: {
                  negativeAge: (value) => {
                    if (value < 0) {
                      return "Age can't be negative";
                    }
                  },
                  minAge: (value) => {
                    if (value < 18) {
                      return "Age should be minimum 18";
                    }
                  },
                },
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("terms", {
                required: "You must accept the Terms & Conditions",
              })}
              className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms & Conditions
              </a>
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="grid grid-cols-3 gap-4">
          <button
            disabled={!currentTerms || !isDirty}
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:opacity-60"
          >
            Submit
          </button>
          <button
            onClick={getLogsAndSession}
            type="button"
            className="w-full rounded-md bg-sky-600 py-2 text-white font-medium hover:bg-sky-700 transition-colors"
          >
            Logs
          </button>
          <button
            onClick={() => reset()}
            type="button"
            className="w-full rounded-md bg-sky-600 py-2 text-white font-medium hover:bg-sky-700 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => trigger()}
            type="button"
            className="w-full rounded-md bg-fuchsia-600 py-2 text-white font-medium hover:bg-fuchsia-700 transition-colors"
          >
            Validate
          </button>
          <button
            onClick={() => {
              void dummyApiTrigger();
            }}
            type="button"
            className="w-full rounded-md bg-gray-600 py-2 text-white font-medium hover:bg-gray-700 transition-colors"
          >
            DummyApi
          </button>
          {sessionData.data && (
            <button
              onClick={signOutHandler}
              type="button"
              className="w-full rounded-md bg-pink-600 py-2 text-white font-medium hover:bg-pink-700 transition-colors"
            >
              SignOut
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
