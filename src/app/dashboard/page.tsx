import { VenueGrid, EventsGrid, VenueList } from "@/components";
import { fetchVenues } from "@/actions/venue.action";
import { fetchEvents } from "@/actions/events.action";
import { JSX } from "react";

export const dynamic = "force-dynamic";

const DashboardPage: React.FC = async (): Promise<JSX.Element> => {
  const [{ data: venuesData }, { data: eventsData }] = await Promise.all([
    fetchVenues(1, 8),
    fetchEvents(1, 8),
  ]);

  return (
    <div>
      <div className="flex gap-3 flex-col">
        <VenueGrid venuesData={venuesData} showSeeAll={true} />
        <EventsGrid eventsData={eventsData} showSeeAll={true} />
        <VenueList venues={venuesData?.venues || []} />
      </div>
    </div>
  );
};

export default DashboardPage;
