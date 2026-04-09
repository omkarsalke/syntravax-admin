import React, { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

function StaffManagement({ companyId }) {
  const [staff, setStaff] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Cleaner");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchStaff = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "companies", companyId, "staff"));
    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStaff(list);
  }, [companyId]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleAddStaff = async () => {
    if (!name || !email) {
      setMessage("⚠️ Please fill in both name and email.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "companies", companyId, "staff"), {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      });
      setName("");
      setEmail("");
      setRole("Cleaner");
      setMessage("✅ Staff member added successfully!");
      fetchStaff();
    } catch (error) {
      setMessage("❌ Error adding staff: " + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      await deleteDoc(doc(db, "companies", companyId, "staff", id));
      setMessage("🗑️ Staff member removed.");
      fetchStaff();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Staff Management
      </h2>

      {/* Add Staff Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Add New Staff Member
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Patil"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Google Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@gmail.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Cleaner</option>
              <option>Maintenance</option>
              <option>Cook</option>
              <option>Security</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleAddStaff}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          {loading ? "Adding..." : "Add Staff Member"}
        </button>
        {message && (
          <p className="mt-3 text-sm text-gray-600">{message}</p>
        )}
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          All Staff Members ({staff.length})
        </h3>
        {staff.length === 0 ? (
          <p className="text-gray-400">No staff members added yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 rounded-tl-lg">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member, index) => (
                <tr key={member.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{member.name}</td>
                  <td className="px-4 py-3 text-gray-600">{member.email}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Remove
                    </button>
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

export default StaffManagement;