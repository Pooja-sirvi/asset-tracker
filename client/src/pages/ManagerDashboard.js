import React, { useState } from "react";

function ManagerDashboard() {
  // Sample employee + asset data
  const [assets, setAssets] = useState([
    {
      id: 1,
      employee: "John Doe",
      email: "employee@test.com",
      asset: "Laptop - Dell XPS",
      status: "In Use",
      request: "",
    },
    {
      id: 2,
      employee: "Alice Smith",
      email: "alice@test.com",
      asset: "Headset - Logitech",
      status: "In Use",
      request: "Return",
    },
  ]);

  const handleAction = (id, action) => {
    setAssets((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: action, request: "" } : item
      )
    );
    alert(`Asset for Employee ID ${id} marked as ${action}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#124191] to-blue-500 p-8">
      <div className="bg-white shadow-2xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#124191] mb-6 text-center">
          Manager Dashboard
        </h1>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#124191] text-white">
              <th className="border p-3">ID</th>
              <th className="border p-3">Employee</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Asset</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Request</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border p-3">{item.id}</td>
                <td className="border p-3">{item.employee}</td>
                <td className="border p-3">{item.email}</td>
                <td className="border p-3">{item.asset}</td>
                <td className="border p-3">{item.status}</td>
                <td className="border p-3">{item.request || "—"}</td>
                <td className="border p-3 space-x-2">
                  <button
                    onClick={() => handleAction(item.id, "Returned")}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                  >
                    Approve Return
                  </button>
                  <button
                    onClick={() => handleAction(item.id, "Replaced")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    Approve Replacement
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagerDashboard;
