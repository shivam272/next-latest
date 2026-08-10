import { fetchVenues } from "@/actions/venue.action";
import { VisualTable } from "@/components/Ui";

export const VenueList: React.FC = async () => {
  const { data: venues, status, message } = await fetchVenues();

  if (status !== 200) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Venue List</h2>
        <p className="text-red-500">Error fetching venues: {message}</p>
      </div>
    );
  }

  if (!venues || venues.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Venue List</h2>
        <p>No venues available.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Venue List</h2>
      <VisualTable
        tableCols={["Name", "Address", "Location", "Actions"]}
        tableData={venues}
      />
    </div>
  );
};
