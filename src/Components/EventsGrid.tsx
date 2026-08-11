"use client";
import { JSX } from "react";
import { Section, CardList } from "@/components/Ui";
import Link from "next/link";
import { toast } from "react-toastify";
import { IEventPaginationResponse } from "@/types";
import { useState } from "react";
import { fetchEvents } from "@/actions/events.action";

interface IEventsGridProps {
  eventsData: IEventPaginationResponse;
  showLoadMore?: boolean;
  showSeeAll?: boolean;
}

export const EventsGrid: React.FC<IEventsGridProps> = (
  props,
): JSX.Element | null => {
  const { eventsData, showLoadMore, showSeeAll } = props;
  const { events, page, limit, hasNextPage, hasPreviousPage } = eventsData;

  const [currentPage, setCurrentPage] = useState(page);
  const [hasNext, setHasNext] = useState(hasNextPage);
  const [hasPrevious, setHasPrevious] = useState(hasPreviousPage);
  const [eventsList, setEventsList] = useState(events);

  const fetchEventsHandler = async (page: number) => {
    const response = await fetchEvents(page, limit);
    if (response.status === 200 && response.data) {
      const {
        data: { events, hasNextPage, hasPreviousPage },
      } = response;
      setEventsList(events || []);
      setCurrentPage(page);
      setHasNext(hasNextPage);
      setHasPrevious(hasPreviousPage);
    } else {
      toast.error(response.message || "Failed to fetch events");
    }
  };

  if (eventsList.length) {
    return (
      <Section>
        <div className="flex items-center justify-between mb-2 p-2">
          <div className="text-2xl font-bold">List of Events</div>
          {showSeeAll && (
            <Link href="/dashboard/events" className="btn btn-primary">
              See All Events
            </Link>
          )}
        </div>
        <CardList
          list={eventsList.map((event) => ({
            imageSrc:
              "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp",
            title: event.name,
            description: event.description,
            height: 200,
            width: 300,
            date: event.date,
            time: event.time,
            organizer: event.organizer,
            artist: event.artist,
            country: event.venueCity,
            venueName: event.venueName,
            capacity: event.capacity,
            price: event.price,
            ageRestriction: event.ageRestriction,
            id: event.id,
            mainBadge: { text: `${event.duration} mns` },
            secondaryBadges: event.addOns.map((addOn) => ({
              text: addOn.name,
            })),
          }))}
        />
        {showLoadMore && (
          <div className="flex justify-center mt-4">
            <div className="join grid grid-cols-2">
              <button
                className="join-item btn btn-outline hover:bg-blue-600 hover:text-white"
                disabled={!hasPrevious}
                onClick={() => fetchEventsHandler(currentPage - 1)}
              >
                Previous page
              </button>
              <button
                className="join-item btn btn-outline hover:bg-blue-600 hover:text-white"
                disabled={!hasNext}
                onClick={() => fetchEventsHandler(currentPage + 1)}
              >
                Next Page
              </button>
            </div>
          </div>
        )}
      </Section>
    );
  }
  return null;
};
