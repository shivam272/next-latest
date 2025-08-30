import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-600">
        Page Not Found
      </h2>
      <p className="mt-2 text-gray-500">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Link
        href="/news"
        className="mt-6 rounded-2xl bg-blue-600 px-6 py-3 text-white shadow-md transition hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}
