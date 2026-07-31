"use client";
import { useForm } from "react-hook-form";

enum EGenderEnum {
  female = "female",
  male = "male",
  other = "other",
}

interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  gender: EGenderEnum;
  password: string;
  confirmPassword: string;
  terms: boolean;
  phone: string[];
}

export const FormComp = () => {
  const {
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      terms: true,
      phone: ["", ""],
    },
  });

  const onSubmitHandler = (data: IFormInput) => {
    console.log(data);
    reset();
  };

  const currentPassword = watch("password");
  const currentTerms = watch("terms");
  const [primaryPhone] = watch("phone");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="w-full max-w-xl bg-white p-8 rounded-xl shadow-md space-y-5"
        onSubmit={handleSubmit(onSubmitHandler)}
        noValidate
      >
        {/* First Name & Last Name Side-by-Side */}
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

        {/* Email */}
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
                  value: /^[6-9]\d{9}$/,
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
                  value: /^[6-9]\d{9}$/,
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

        {/* Gender Selection */}
        <div>
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
        <button
          disabled={!currentTerms}
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:opacity-60"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
