import { EventForm } from "@/components";
import { validateVenueId } from "@/actions/venue.action";
import Link from "next/link";

interface CreateEventPageProps {
  searchParams: Promise<{
    venueId?: string;
  }>;
}

export const CreateEventPage: React.FC<CreateEventPageProps> = async ({
  searchParams,
}) => {
  const { venueId } = await searchParams;

  if (venueId && (await validateVenueId(venueId))) {
    return (
      <div>
        <div className="my-3">
          <EventForm venueId={venueId} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center mt-5 bg-gray-50 ">
      <div className="p-6  bg-white rounded-lg shadow-md flex flex-col items-center">
        <p className="text-red-500 text-lg font-semibold">
          Invalid or missing venue ID.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default CreateEventPage;
