import React, { useState } from "react";
import StaffManagement from "./StaffManagement";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import TaskAssignment from "./TaskAssignment";
import AttendanceLogs from "./AttendanceLogs";
import TaskCompletions from "./TaskCompletions";
import WifiSettings from "./WifiSettings";

function Dashboard({ user, companyId }) {
  const [activePage, setActivePage] = useState("staff");

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold">Syntravax</h1>
          <p className="text-blue-300 text-sm mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActivePage("staff")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
              activePage === "staff" ? "bg-blue-600" : "hover:bg-blue-700"
            }`}
          >
            👥 Staff Management
          </button>
          <button
            onClick={() => setActivePage("tasks")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
              activePage === "tasks" ? "bg-blue-600" : "hover:bg-blue-700"
            }`}
          >
            📋 Task Assignment
          </button>
          <button
            onClick={() => setActivePage("attendance")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
              activePage === "attendance" ? "bg-blue-600" : "hover:bg-blue-700"
            }`}
          >  
            📅 Attendance Logs
          </button>
          <button
           onClick={() => setActivePage("wifi")}
           className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
             activePage === "wifi" ? "bg-blue-600" : "hover:bg-blue-700"
            }`}
          >
            📶 Wi-Fi Settings
          </button>
          <button
            onClick={() => setActivePage("completions")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
              activePage === "completions" ? "bg-blue-600" : "hover:bg-blue-700"
            }`}
          >
            ✅ Task Completions
          </button>
        </nav>

        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user.photoURL}
              alt="Admin"
              className="w-9 h-9 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">{user.displayName}</p>
              <p className="text-xs text-blue-300">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {activePage === "staff" && <StaffManagement companyId={companyId} />}
        {activePage === "tasks" && <TaskAssignment companyId={companyId} />}
        {activePage === "attendance" && <AttendanceLogs companyId={companyId} />}
        {activePage === "completions" && <TaskCompletions companyId={companyId} />}
        {activePage === "wifi" && <WifiSettings companyId={companyId} />}
      </div>
    </div>
  );
}

export default Dashboard;