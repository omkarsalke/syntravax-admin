import React, { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function AttendanceLogs({ companyId }) {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "companies", companyId, "attendance"),
        orderBy("checkIn", "desc")
      );
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLogs(list);
      setFiltered(list);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
    setLoading(false);
  }, [companyId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleDateFilter = (date) => {
    setSelectedDate(date);
    if (!date) {
      setFiltered(logs);
      return;
    }
    const filteredLogs = logs.filter((log) => {
      const logDate = new Date(log.checkIn).toISOString().split("T")[0];
      return logDate === date;
    });
    setFiltered(filteredLogs);
  };

  const formatTime = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "—";
    const diff = new Date(checkOut) - new Date(checkIn);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusBadge = (checkOut) => {
    if (!checkOut) {
      return (
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
          🟢 Currently In
        </span>
      );
    }
    return (
      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
        ⚪ Checked Out
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Attendance Logs
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Total Records</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {logs.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Currently In Office</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {logs.filter((l) => !l.checkOut).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Checked Out Today</p>
          <p className="text-3xl font-bold text-gray-600 mt-1">
            {
              logs.filter((l) => {
                if (!l.checkOut) return false;
                const today = new Date().toISOString().split("T")[0];
                const logDate = new Date(l.checkOut)
                  .toISOString()
                  .split("T")[0];
                return logDate === today;
              }).length
            }
          </p>
        </div>
      </div>

      {/* Filter + Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            All Records ({filtered.length})
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {selectedDate && (
              <button
                onClick={() => handleDateFilter("")}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading attendance records...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">
            No attendance records found.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Staff Name</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Check In</th>
                <th className="px-4 py-3">Check Out</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, index) => (
                <tr key={log.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{log.staffName}</p>
                    <p className="text-gray-400 text-xs">{log.staffEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(log.checkIn)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatTime(log.checkIn)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatTime(log.checkOut)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {getDuration(log.checkIn, log.checkOut)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(log.checkOut)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AttendanceLogs;