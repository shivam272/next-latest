import { fetchVenues } from "@/actions/venue.action";
import { VenueGrid } from "@/components";

export const dynamic = "force-dynamic";

const VenuesPage = async () => {
  const { data: venuesData } = await fetchVenues(1, 4);
  return <VenueGrid venuesData={venuesData} showLoadMore />;
};

export default VenuesPage;
