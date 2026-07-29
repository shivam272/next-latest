"use client"; // Error boundaries must be Client Components
import { useEffect } from "react";

type ErrorCompProps = {
  error: Error & { digest?: string }; // it combines the both properties
  reset: () => void;
};

const Error: React.FC<ErrorCompProps> = (props) => {
  const { error, reset } = props;
  console.log(props);
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong! {error.message}</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
};

export default Error;
