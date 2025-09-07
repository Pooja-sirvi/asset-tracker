import React, { useState, useContext } from "react";
import { RequestContext } from "../context/RequestContext";

function EmployeeDashboard() {
  const { addRequest } = useContext(RequestContext);

  const [employee] = useState({
    employeeId: "EMP12345",
    email: "employee@test.com",
    name: "John Doe",
    role: "Customer Support Executive",
    lineManagerId: "MGR56789",
    callCenterName: "Nokia Mysore Center",
  });

  const [assets] = useState([
    { id: "LAP123", name: "Dell XPS", status: "Assigned", assignedDate: "2024-05-01" },
    { id: "LAP456", name: "HP EliteBook", status: "Assigned", assignedDate: "2024-06-15" },
  ]);

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [requestType, setRequestType] = useState("");
  const [reason, setReason] = useState("");

  const handleActionClick = (assetId, type) => {
    setSelectedAsset(assetId);
    setRequestType(type);
  };

  const handleSubmit = () => {
    if (!selectedAsset || !requestType) {
      alert("Please select an asset and request type first.");
      return;
    }
    if (!reason.trim()) {
      alert("Please provide a reason for the request.");
      return;
    }

    addRequest({
      employeeId: employee.employeeId,
      assetId: selectedAsset,
      requestType,
      reason,
      status: "Pending",
    });

    alert("Request submitted successfully!");

    // reset form
    setSelectedAsset(null);
    setRequestType("");
    setReason("");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Employee Dashboard
      </h1>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Profile Details
        </h2>
        <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-medium text-gray-600">Employee ID</td>
              <td className="p-3">{employee.employeeId}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium text-gray-600">Email</td>
              <td className="p-3">{employee.email}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium text-gray-600">Name</td>
              <td className="p-3">{employee.name}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium text-gray-600">Role</td>
              <td className="p-3">{employee.role}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium text-gray-600">Line Manager ID</td>
              <td className="p-3">{employee.lineManagerId}</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-gray-600">Call Center Name</td>
              <td className="p-3">{employee.callCenterName}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Assets Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Assigned Assets
        </h2>
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Asset ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Assigned Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="border-b">
                <td className="p-3">{asset.id}</td>
                <td className="p-3">{asset.name}</td>
                <td className="p-3">{asset.status}</td>
                <td className="p-3">{asset.assignedDate}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleActionClick(asset.id, "Return")}
                    className={`px-3 py-1 rounded-lg mr-2 ${
                      selectedAsset === asset.id && requestType === "Return"
                        ? "bg-yellow-600 text-white"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                  >
                    Return
                  </button>
                  <button
                    onClick={() => handleActionClick(asset.id, "Replacement")}
                    className={`px-3 py-1 rounded-lg ${
                      selectedAsset === asset.id && requestType === "Replacement"
                        ? "bg-red-600 text-white"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    Replacement
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Reason + Submit */}
        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-2">
            Reason for Request (max 100 words)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={600}
            placeholder="Describe the issue with your asset..."
            className="w-full border rounded-lg p-3 h-24 mb-4"
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
