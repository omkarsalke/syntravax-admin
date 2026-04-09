import React, { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function TaskCompletions({ companyId }) {
  const [completions, setCompletions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const fetchCompletions = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "companies", companyId, "completions"),
        orderBy("completedAt", "desc")
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompletions(list);
      setFiltered(list);

      const uniqueStaff = [...new Set(list.map((c) => c.staffName))];
      setStaffList(uniqueStaff);
    } catch (error) {
      console.error("Error fetching completions:", error);
    }
    setLoading(false);
  }, [companyId]);

  useEffect(() => {
    fetchCompletions();
  }, [fetchCompletions]);

  const applyFilters = (date, staff) => {
    let result = completions;
    if (date) {
      result = result.filter((c) => c.date === date);
    }
    if (staff) {
      result = result.filter((c) => c.staffName === staff);
    }
    setFiltered(result);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    applyFilters(date, selectedStaff);
  };

  const handleStaffChange = (staff) => {
    setSelectedStaff(staff);
    applyFilters(selectedDate, staff);
  };

  const clearFilters = () => {
    setSelectedDate("");
    setSelectedStaff("");
    setFiltered(completions);
  };

  const formatDateTime = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Task Completions
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Total Completions</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {completions.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Completed Today</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {completions.filter((c) => c.date === new Date().toISOString().split("T")[0]).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">With Photo Proof</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">
            {completions.filter((c) => c.photoUrl).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Filter by Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Filter by Staff
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => handleStaffChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Staff</option>
              {staffList.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          {(selectedDate || selectedStaff) && (
            <button
              onClick={clearFilters}
              className="mt-5 text-sm text-red-500 hover:text-red-700"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Completions Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          All Completions ({filtered.length})
        </h3>
        {loading ? (
          <p className="text-gray-400">Loading completions...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No completions found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Staff</th>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Completed At</th>
                <th className="px-4 py-3">Photo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.staffName}</p>
                    <p className="text-gray-400 text-xs">{item.staffEmail}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {item.taskTitle}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDateTime(item.completedAt)}
                  </td>
                  <td className="px-4 py-3">
                    {item.photoUrl ? (
                      <button
                        onClick={() => setPreviewPhoto(item.photoUrl)}
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded-lg text-xs font-medium"
                      >
                        View Photo
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">No photo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="relative">
            <img
              src={previewPhoto}
              alt="Proof"
              className="max-w-lg max-h-screen rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-2 right-2 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCompletions;