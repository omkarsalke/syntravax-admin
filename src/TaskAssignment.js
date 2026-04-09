import React, { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

function TaskAssignment({ companyId }) {
  const [staff, setStaff] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchStaff = useCallback(async () => {
  const querySnapshot = await getDocs(collection(db, "companies", companyId, "staff"));
  const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  setStaff(list);
}, [companyId]);

const fetchTasks = useCallback(async () => {
  const querySnapshot = await getDocs(collection(db, "companies", companyId, "tasks"));
  const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  setTasks(list);
}, [companyId]);

  useEffect(() => {
    fetchStaff();
    fetchTasks();
  }, [fetchStaff, fetchTasks]);

  const handleAddTask = async () => {
    if (!selectedStaff || !taskTitle) {
      setMessage("⚠️ Please select a staff member and enter a task title.");
      return;
    }
    setLoading(true);
    try {
      const staffMember = staff.find((s) => s.id === selectedStaff);
      await addDoc(collection(db, "companies", companyId, "tasks"), {
        staffId: selectedStaff,
        staffName: staffMember.name,
        staffEmail: staffMember.email,
        taskTitle,
        taskDescription,
        frequency,
        createdAt: new Date().toISOString(),
      });
      setSelectedStaff("");
      setTaskTitle("");
      setTaskDescription("");
      setFrequency("Daily");
      setMessage("✅ Task assigned successfully!");
      fetchTasks();
    } catch (error) {
      setMessage("❌ Error assigning task: " + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteDoc(doc(db, "companies", companyId, "tasks", id));
      setMessage("🗑️ Task deleted.");
      fetchTasks();
    }
  };

  const getFrequencyColor = (freq) => {
    switch (freq) {
      case "Daily": return "bg-green-100 text-green-700";
      case "Alternate Days": return "bg-yellow-100 text-yellow-700";
      case "Weekly": return "bg-blue-100 text-blue-700";
      case "Monthly": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Task Assignment
      </h2>

      {/* Add Task Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Assign New Task
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Select Staff Member
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Staff --</option>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Clean lobby floor"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Task Description (optional)
            </label>
            <input
              type="text"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="e.g. Use disinfectant and mop thoroughly"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Daily</option>
              <option>Alternate Days</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleAddTask}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          {loading ? "Assigning..." : "Assign Task"}
        </button>
        {message && (
          <p className="mt-3 text-sm text-gray-600">{message}</p>
        )}
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          All Assigned Tasks ({tasks.length})
        </h3>
        {tasks.length === 0 ? (
          <p className="text-gray-400">No tasks assigned yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Frequency</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{task.taskTitle}</p>
                    {task.taskDescription && (
                      <p className="text-gray-400 text-xs mt-1">
                        {task.taskDescription}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{task.staffName}</p>
                    <p className="text-gray-400 text-xs">{task.staffEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFrequencyColor(task.frequency)}`}>
                      {task.frequency}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Delete
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

export default TaskAssignment;