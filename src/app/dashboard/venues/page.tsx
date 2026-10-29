import { fetchVenues } from "@/actions/venue.action";
import { VenueGrid } from "@/components";

export const dynamic = "force-dynamic"; // opt out of static rendering for this page

const VenuesPage = async () => {
  const { data: venuesData } = await fetchVenues(1, 4);
  if (venuesData) {
    return <VenueGrid venuesData={venuesData} showLoadMore />;
  }
  return <div>No Data found</div>;
};

export default VenuesPage;
