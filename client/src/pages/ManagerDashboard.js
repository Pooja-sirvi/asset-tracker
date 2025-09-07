import React, { useState, useContext } from "react";
import { RequestContext } from "../context/RequestContext";

function ManagerDashboard() {
  const { requests, updateRequestStatus } = useContext(RequestContext);

  // Manager profile (static for now, later dynamic)
  const [manager] = useState({
    managerId: "MGR56789",
    name: "Jane Smith",
    email: "manager@test.com",
    role: "Team Manager",
    callCenterName: "Nokia Mysore Center",
  });

  // Employees under this manager (with assets)
  const [employees] = useState([
    {
      employeeId: "EMP12345",
      name: "John Doe",
      email: "employee@test.com",
      assets: [
        {
          id: "LAP123",
          name: "Dell XPS",
          issueDate: "2024-05-01",
          status: "In Use",
          returnDate: null,
        },
      ],
    },
    {
      employeeId: "EMP67890",
      name: "Alice Johnson",
      email: "alice@test.com",
      assets: [
        {
          id: "LAP456",
          name: "HP EliteBook",
          issueDate: "2024-06-15",
          status: "Returned",
          returnDate: "2024-08-01",
        },
      ],
    },
  ]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Manager Dashboard
      </h1>

      {/* Manager Profile */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Manager Profile
        </h2>
        <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-medium text-gray-600">Manager ID</td>
              <td className="p-3">{manager.managerId}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium text-gray-600">Name</td>
              <td className="p-3">{manager.name}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium text-gray-600">Email</td>
              <td className="p-3">{manager.email}</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium text-gray-600">Role</td>
              <td className="p-3">{manager.role}</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-gray-600">Call Center Name</td>
              <td className="p-3">{manager.callCenterName}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Employees & Assets */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Employees Under you
        </h2>
        {employees.map((emp) => (
          <div key={emp.employeeId} className="mb-6">
            <h3 className="text-lg font-bold text-blue-600 mb-2">
              {emp.name} ({emp.employeeId}) – {emp.email}
            </h3>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Asset ID</th>
                  <th className="p-3 text-left">Asset Name</th>
                  <th className="p-3 text-left">Issue Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Return Date</th>
                </tr>
              </thead>
              <tbody>
                {emp.assets.map((asset) => (
                  <tr key={asset.id} className="border-b">
                    <td className="p-3">{asset.id}</td>
                    <td className="p-3">{asset.name}</td>
                    <td className="p-3">{asset.issueDate}</td>
                    <td
                      className={`p-3 font-medium ${
                        asset.status === "In Use"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {asset.status}
                    </td>
                    <td className="p-3">
                      {asset.returnDate ? asset.returnDate : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Employee Requests */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Pending Requests
        </h2>
        {requests.length === 0 ? (
          <p className="text-gray-600">No requests submitted yet.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee ID</th>
                <th className="p-3 text-left">Asset ID</th>
                <th className="p-3 text-left">Request Type</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b">
                  <td className="p-3">{req.employeeId}</td>
                  <td className="p-3">{req.assetId}</td>
                  <td className="p-3">{req.requestType}</td>
                  <td className="p-3">{req.reason}</td>
                  <td className="p-3 font-medium">
                    {req.status === "Pending" ? (
                      <span className="text-yellow-600">{req.status}</span>
                    ) : req.status === "Approved" ? (
                      <span className="text-green-600">{req.status}</span>
                    ) : (
                      <span className="text-red-600">{req.status}</span>
                    )}
                  </td>
                  <td className="p-3">
                    {req.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateRequestStatus(req.id, "Approved")
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            updateRequestStatus(req.id, "Rejected")
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {req.status !== "Pending" && (
                      <span className="italic text-gray-500">
                        No action needed
                      </span>
                    )}
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

export default ManagerDashboard;
