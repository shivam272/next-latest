"use client";

import { useState } from "react";
import Link from "next/link";
import { type IVenueRecords } from "@/types";

interface VisualTableProps {
  tableCols: string[];
  tableData: IVenueRecords[];
}

export const VisualTable = ({ tableCols, tableData }: VisualTableProps) => {
  const [selectedVenue, setSelectedVenue] = useState<IVenueRecords | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="table text-base capitalize">
        <thead>
          <tr className="text-sm font-semibold">
            {tableCols.map((col, index) => (
              <th key={`col-${index}`}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => {
            const { name, country, address, amenities, city, state } = data;
            return (
              <tr key={`${name}-${index}`}>
                <td>
                  <div className="font-bold">{name}</div>
                  <div className="text-xs opacity-50">{country}</div>
                </td>
                <td>
                  <span className="font-semibold">{address}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {amenities.map((amenity, i) => (
                      <span key={`amenity-${i}`} className="badge badge-secondary badge-xs">
                        {amenity.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{`${city}, ${state}`}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline btn-info"
                      onClick={() => setSelectedVenue(data)}
                    >
                      👁 View Docs
                    </button>
                    <Link
                      className="btn btn-sm btn-primary"
                      href={`/dashboard/create-event?venueId=${data.id}`}
                    >
                      Add Event
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* View Docs Modal */}
      {selectedVenue && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl" data-theme="light">
            <h3 className="font-bold text-lg mb-4">
              Documents for {selectedVenue.name}
            </h3>

            {/* Profile Image */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Profile Image:</h4>
              {selectedVenue.image?.publicUrl ? (
                <div className="flex items-center gap-4">
                  <img
                    src={selectedVenue.image.publicUrl}
                    alt="Venue Profile"
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <a
                    href={selectedVenue.image.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-xs btn-outline"
                  >
                    Open Full Image ↗
                  </a>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No profile image uploaded.</p>
              )}
            </div>

            {/* Aadhaar Cards */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Aadhaar Card(s):</h4>
              {selectedVenue.adhaarCard && selectedVenue.adhaarCard.length > 0 ? (
                <ul className="space-y-2">
                  {selectedVenue.adhaarCard.map((card, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm"
                    >
                      <span className="truncate max-w-[70%]">📄 {card.filename || "Aadhaar Card"}</span>
                      <a
                        href={card.publicUrl || card.path}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-xs btn-primary"
                      >
                        View / Download
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No Aadhaar cards uploaded.</p>
              )}
            </div>

            {/* Qualifications */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Qualification Document(s):</h4>
              {selectedVenue.qualification && selectedVenue.qualification.length > 0 ? (
                <ul className="space-y-2">
                  {selectedVenue.qualification.map((qual, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm"
                    >
                      <span className="truncate max-w-[70%]">📜 {qual.filename || "Qualification Doc"}</span>
                      <a
                        href={qual.publicUrl || qual.path}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-xs btn-primary"
                      >
                        View / Download
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No qualifications uploaded.</p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setSelectedVenue(null)}
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setSelectedVenue(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};
