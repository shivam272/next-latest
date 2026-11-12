"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { type IVenueRecords, type IAdhaarCard } from "@/types";

interface VisualTableProps {
  tableCols: string[];
  tableData: IVenueRecords[];
}

export const VisualTable = ({ tableCols, tableData }: VisualTableProps) => {
  const [dataList, setDataList] = useState<IVenueRecords[]>(tableData);
  const [selectedVenue, setSelectedVenue] = useState<IVenueRecords | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingReplace, setPendingReplace] = useState<{
    field: "image" | "adhaarCard" | "qualification";
    oldPath?: string;
    fileIndex?: number;
  } | null>(null);

  // Keep selected venue synchronized with table data list
  const activeVenue = selectedVenue
    ? dataList.find((v) => v.id === selectedVenue.id) || selectedVenue
    : null;

  const handleDeleteFile = async (
    field: "image" | "adhaarCard" | "qualification",
    filePath?: string,
  ) => {
    if (!activeVenue || !filePath) return;
    if (!confirm("Are you sure you want to delete this document?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/create-venue", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeVenue.id,
          field,
          filePath,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Delete failed");

      // Update state locally
      setDataList((prev) =>
        prev.map((v) => {
          if (v.id !== activeVenue.id) return v;
          if (field === "image") {
            return { ...v, image: undefined };
          }
          return {
            ...v,
            [field]: (v[field] || []).filter(
              (item: IAdhaarCard) => item.path !== filePath,
            ),
          };
        }),
      );
    } catch (err: any) {
      alert(err.message || "Failed to delete document");
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerReplace = (
    field: "image" | "adhaarCard" | "qualification",
    oldPath?: string,
    fileIndex?: number,
  ) => {
    setPendingReplace({ field, oldPath, fileIndex });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingReplace || !activeVenue) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", activeVenue.id);
      formData.append("field", pendingReplace.field);
      if (pendingReplace.oldPath) {
        formData.append("oldPath", pendingReplace.oldPath);
      }
      if (pendingReplace.fileIndex !== undefined) {
        formData.append("fileIndex", String(pendingReplace.fileIndex));
      }
      formData.append("file", file);

      const res = await fetch("/api/dashboard/create-venue", {
        method: "PATCH",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Replace failed");

      // Reload or sync state from API response if returned
      if (json.venue) {
        setDataList((prev) =>
          prev.map((v) =>
            v.id === activeVenue.id
              ? {
                  ...v,
                  image: json.venue.image,
                  adhaarCard: json.venue.adhaarCard,
                  qualification: json.venue.qualification,
                }
              : v,
          ),
        );
      }
    } catch (err: any) {
      alert(err.message || "Failed to update document");
    } finally {
      setLoading(false);
      setPendingReplace(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Hidden file input for file replacement */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFilePicked}
        className="hidden"
      />

      <table className="table text-base capitalize">
        <thead>
          <tr className="text-sm font-semibold">
            {tableCols.map((col, index) => (
              <th key={`col-${index}`}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataList.map((data, index) => {
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
                      <span
                        key={`amenity-${i}`}
                        className="badge badge-secondary badge-xs"
                      >
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

      {activeVenue && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl relative" data-theme="light">
            {loading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-50">
                <span className="loading loading-spinner loading-md text-primary"></span>
                <span className="ml-2 font-medium text-sm">Processing...</span>
              </div>
            )}

            <h3 className="font-bold text-lg mb-4">
              Documents for {activeVenue.name}
            </h3>

            <div className="mb-4 pb-4 border-b">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">
                Profile Image:
              </h4>
              {activeVenue.image?.publicUrl || activeVenue.image?.path ? (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        activeVenue.image.publicUrl || activeVenue.image.path
                      }
                      alt="Venue Profile"
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div>
                      <div className="text-xs font-semibold truncate max-w-[200px]">
                        {activeVenue.image.filename || "Profile Image"}
                      </div>
                      <a
                        href={
                          activeVenue.image.publicUrl || activeVenue.image.path
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Open Full Image ↗
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-xs btn-outline btn-warning"
                      onClick={() =>
                        handleTriggerReplace("image", activeVenue.image?.path)
                      }
                      disabled={loading}
                    >
                      🔄 Change
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline btn-error"
                      onClick={() =>
                        handleDeleteFile("image", activeVenue.image?.path)
                      }
                      disabled={loading}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm text-gray-400">
                  <span>No profile image uploaded.</span>
                  <button
                    type="button"
                    className="btn btn-xs btn-outline btn-primary"
                    onClick={() => handleTriggerReplace("image")}
                    disabled={loading}
                  >
                    + Upload
                  </button>
                </div>
              )}
            </div>

            <div className="mb-4 pb-4 border-b">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">
                Aadhaar Card(s):
              </h4>
              {activeVenue.adhaarCard && activeVenue.adhaarCard.length > 0 ? (
                <ul className="space-y-2">
                  {activeVenue.adhaarCard.map((card, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm"
                    >
                      <span className="truncate max-w-[45%]">
                        📄 {card.filename || "Aadhaar Card"}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={card.publicUrl || card.path}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-xs btn-primary"
                        >
                          View
                        </a>
                        <button
                          type="button"
                          className="btn btn-xs btn-outline btn-warning"
                          onClick={() =>
                            handleTriggerReplace("adhaarCard", card.path, idx)
                          }
                          disabled={loading}
                        >
                          🔄 Change
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs btn-outline btn-error"
                          onClick={() =>
                            handleDeleteFile("adhaarCard", card.path)
                          }
                          disabled={loading}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">
                  No Aadhaar cards uploaded.
                </p>
              )}
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">
                Qualification Document(s):
              </h4>
              {activeVenue.qualification &&
              activeVenue.qualification.length > 0 ? (
                <ul className="space-y-2">
                  {activeVenue.qualification.map((qual, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm"
                    >
                      <span className="truncate max-w-[45%]">
                        📜 {qual.filename || "Qualification Doc"}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={qual.publicUrl || qual.path}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-xs btn-primary"
                        >
                          View
                        </a>
                        <button
                          type="button"
                          className="btn btn-xs btn-outline btn-warning"
                          onClick={() =>
                            handleTriggerReplace(
                              "qualification",
                              qual.path,
                              idx,
                            )
                          }
                          disabled={loading}
                        >
                          🔄 Change
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs btn-outline btn-error"
                          onClick={() =>
                            handleDeleteFile("qualification", qual.path)
                          }
                          disabled={loading}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">
                  No qualifications uploaded.
                </p>
              )}
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setSelectedVenue(null)}
                disabled={loading}
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setSelectedVenue(null)}>
              close
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
};
