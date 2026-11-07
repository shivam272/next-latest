import { VisualTable, Section } from "@/components/Ui";
import { JSX } from "react";
import { IVenueRecords } from "@/types";

interface IVenueListProps {
  venues: IVenueRecords[];
}

export const VenueList: React.FC<IVenueListProps> = ({
  venues,
}): JSX.Element | null => {
  if (venues.length) {
    return (
      <Section>
        <h2 className="text-2xl font-bold mb-4">List of top Venues</h2>
        <VisualTable
          tableCols={["Name", "Address", "Location", "Actions"]}
          tableData={venues}
        />
      </Section>
    );
  }
  return null;
};
