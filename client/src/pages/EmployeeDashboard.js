import React from "react";

function EmployeeDashboard() {
  // sample static data (later we can fetch from DB or Excel)
  const employee = {
    id: "EMP001",
    name: "Pooja Sirvi",
    email: "pooja.sirvi@nokia.com",
    manager: "Manager Name",
    callCenter: "Bangalore Call Center",
    asset: {
      machineNumber: "LAP12345",
      type: "Laptop",
      status: "Assigned",
    },
  };

  const handleRequestReturn = () => {
    alert("Request for asset return/replacement sent to Manager!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Employee Dashboard</h1>

      {/* Profile Section */}
      <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Profile Details</h2>
        <p><b>ID:</b> {employee.id}</p>
        <p><b>Name:</b> {employee.name}</p>
        <p><b>Email:</b> {employee.email}</p>
        <p><b>Manager:</b> {employee.manager}</p>
        <p><b>Call Center:</b> {employee.callCenter}</p>
      </div>

      {/* Asset Section */}
      <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Assigned Asset</h2>
        <p><b>Machine Number:</b> {employee.asset.machineNumber}</p>
        <p><b>Type:</b> {employee.asset.type}</p>
        <p><b>Status:</b> {employee.asset.status}</p>
      </div>

      {/* Request Button */}
      <button
        onClick={handleRequestReturn}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Request Asset Return / Replacement
      </button>
    </div>
  );
}

export default EmployeeDashboard;
