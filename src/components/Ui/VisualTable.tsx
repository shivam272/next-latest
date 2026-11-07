import Link from "next/link";

interface ITableData {
  id: string;
  name: string;
  country: string;
  address: string;
  amenities: {
    name: string;
  }[];
  city: string;
  state: string;
}

interface VisualTableProps {
  tableCols: string[];
  tableData: ITableData[];
}

export const VisualTable = (props: VisualTableProps) => {
  const { tableCols, tableData } = props;
  return (
    <div className="overflow-x-auto ">
      <table className="table text-xl capitalize">
        {/* head */}
        <thead>
          <tr className="text-xl">
            {tableCols.map((col, index) => {
              const key = `col-${index}`;
              return <th key={key}>{col}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => {
            const { name, country, address, amenities, city, state } = data;
            const key = `${name}-${index}`;
            return (
              <tr key={key}>
                <td>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-bold">{name}</div>
                      <div className="text-sm opacity-50">{country}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="font-bold">{address}</span>
                  <br />
                  {amenities.map((amenity, index) => {
                    const key = `amenity-${index}`;
                    return (
                      <span key={key} className="badge badge-secondary mr-2">
                        {amenity.name}
                      </span>
                    );
                  })}
                </td>
                <td>{`${city}, ${state}`}</td>
                <td>
                  <Link
                    className="btn btn-primary"
                    href={`/dashboard/create-event?venueId=${data.id}`}
                  >
                    Add Event
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
