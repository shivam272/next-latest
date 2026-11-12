"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface IDocItem {
  _id: string;
  name: string;
  image: { path: string; publicUrl: string; size: number; name: string };
  adhaar: { path: string; publicUrl: string; size: number; name: string };
  qualification: { path: string; publicUrl: string; size: number; name: string }[];
}

export const DocumentSubmissionForm = () => {
  const [profiles, setProfiles] = useState<IDocItem[]>([]);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [adhaarFile, setAdhaarFile] = useState<File | null>(null);
  const [qualFiles, setQualFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/document-profile");
      const json = await res.json();
      if (res.ok) setProfiles(json.data || []);
    } catch {
      toast.error("Failed to load profiles");
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const resetForm = () => {
    setName("");
    setImageFile(null);
    setAdhaarFile(null);
    setQualFiles([]);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && (!name || !imageFile || !adhaarFile || qualFiles.length === 0)) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    if (editingId) formData.append("id", editingId);
    if (name) formData.append("name", name);
    if (imageFile) formData.append("image", imageFile);
    if (adhaarFile) formData.append("adhaar", adhaarFile);
    qualFiles.forEach((file) => formData.append("qualification", file));

    setLoading(true);
    try {
      const res = await fetch("/api/document-profile", {
        method: editingId ? "PATCH" : "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(editingId ? "Updated successfully!" : "Saved successfully!");
        resetForm();
        fetchProfiles();
      } else {
        toast.error(result.message || "Failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document profile?")) return;
    try {
      const res = await fetch(`/api/document-profile?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted successfully!");
        fetchProfiles();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const startEdit = (item: IDocItem) => {
    setEditingId(item._id);
    setName(item.name);
    setImageFile(null);
    setAdhaarFile(null);
    setQualFiles([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 border p-6 rounded bg-white">
        <h2 className="text-xl font-bold">
          {editingId ? "Edit Profile" : "Create Profile"}
        </h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="image" className="text-sm font-medium">
            Profile Image (JPEG, JPG, PDF &le; 1MB)
          </label>
          <input
            id="image"
            type="file"
            accept=".jpeg,.jpg,.pdf"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="adhaar" className="text-sm font-medium">
            Aadhaar Card (PDF &le; 1MB)
          </label>
          <input
            id="adhaar"
            type="file"
            accept=".pdf"
            onChange={(e) => setAdhaarFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="qualification" className="text-sm font-medium">
            Qualifications (PDF &le; 1MB each, Multiple Allowed)
          </label>
          <input
            id="qualification"
            type="file"
            accept=".pdf"
            multiple
            onChange={(e) => setQualFiles(Array.from(e.target.files || []))}
            className="text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border px-4 py-2 rounded text-sm font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List (View / Edit / Delete) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold">Profiles ({profiles.length})</h3>
        {profiles.length === 0 ? (
          <p className="text-sm text-gray-500">No profiles found.</p>
        ) : (
          profiles.map((p) => (
            <div key={p._id} className="border p-4 rounded flex items-center justify-between gap-4 bg-white">
              <div>
                <p className="font-semibold">{p.name}</p>
                <div className="flex gap-3 text-xs text-blue-600 mt-1">
                  <a href={p.image.publicUrl} target="_blank" rel="noreferrer" className="underline">
                    Image ({p.image.name})
                  </a>
                  <a href={p.adhaar.publicUrl} target="_blank" rel="noreferrer" className="underline">
                    Aadhaar ({p.adhaar.name})
                  </a>
                  <span>{p.qualification.length} Qualification(s)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  className="border px-3 py-1 rounded text-xs font-medium"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
