import { EventsGrid } from "@/components/EventsGrid";
import { fetchEvents } from "@/actions/events.action";

const EventsPage = async () => {
  const { data: eventsData } = await fetchEvents(1, 4);
  return <EventsGrid eventsData={eventsData} showLoadMore />;
};

export default EventsPage;
