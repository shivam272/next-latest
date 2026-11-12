"use client";
import { JSX } from "react";
import Link from "next/link";
import { useState } from "react";
import { Section, CardList } from "@/components/Ui";
import { IVenuePaginationResponse, IVenueRecords } from "@/types";
import { fetchVenues } from "@/actions/venue.action";
import { toast } from "react-toastify";

interface IVenueGridProps {
  venuesData: IVenuePaginationResponse;
  showLoadMore?: boolean;
  showSeeAll?: boolean;
}

export const VenueGrid: React.FC<IVenueGridProps> = (
  props: IVenueGridProps,
): JSX.Element | null => {
  const {
    venuesData: {
      venues = [],
      page = 1,
      limit = 4,
      hasNextPage,
      hasPreviousPage,
    } = {},
    showLoadMore,
    showSeeAll,
  } = props;

  const [currentPage, setCurrentPage] = useState(page);
  const [venuesData, setVenuesData] = useState<IVenueRecords[]>(venues);
  const [hasNext, setHasNext] = useState(hasNextPage);
  const [hasPrevious, setHasPrevious] = useState(hasPreviousPage);

  const fetchVenuesHandler = async (page: number) => {
    const response = await fetchVenues(page, limit);
    if (response.status === 200 && response.data) {
      const {
        data: { venues, hasNextPage, hasPreviousPage },
      } = response;
      setVenuesData(venues || []);
      setCurrentPage(page);
      setHasNext(hasNextPage);
      setHasPrevious(hasPreviousPage);
    } else {
      toast.error(response.message || "Failed to fetch venues");
    }
  };

  if (venuesData.length) {
    return (
      <Section>
        <div className="flex items-center justify-between mb-2 p-2">
          <div className="text-2xl font-bold">List of Venues</div>
          {showSeeAll && (
            <Link href="/dashboard/venues" className="btn btn-primary">
              See All Venues
            </Link>
          )}
        </div>
        <CardList
          list={venuesData.map((venue) => ({
            imageSrc:
              "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
            id: venue.id,
            title: venue.name,
            description: venue.address,
            height: 200,
            width: 300,
            capacity: venue.capacity,
            country: venue.country,
            zipcode: venue.zipCode,
            mainBadge: { text: venue.city },
            secondaryBadges: venue.amenities.map((amenity) => ({
              text: amenity.name,
            })),
          }))}
        />
        {showLoadMore && (
          <div className="flex justify-center mt-4">
            <div className="join grid grid-cols-2">
              <button
                className="join-item btn btn-outline hover:bg-blue-600 hover:text-white"
                disabled={!hasPrevious}
                onClick={() => fetchVenuesHandler(currentPage - 1)}
              >
                Previous page
              </button>
              <button
                className="join-item btn btn-outline hover:bg-blue-600 hover:text-white"
                disabled={!hasNext}
                onClick={() => fetchVenuesHandler(currentPage + 1)}
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
