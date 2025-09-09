import React, { useState } from "react";

function TeamAssetManagerDashboard() {
  // Dummy Manager Details
  const managerDetails = {
    name: "John Doe",
    managerId: "MGR001",
    email: "john.doe@nokia.com",
    managerEmail: "john.manager@nokia.com",
    costCenterId: "CC1001",
  };

  // Dummy Assets Data
  const [assets, setAssets] = useState([
    {
      serial: "LAP001",
      manufacturer: "Dell",
      model: "Latitude 7420",
      date: "2025-09-01",
      costCenterId: "CC1001",
      status: "Assigned",
      assignedTo: {
        employeeId: "EMP101",
        email: "emp101@nokia.com",
        lineManager: "John Manager",
        lineManagerId: "MGR001",
        costCenterId: "CC1001",
      },
    },
    {
      serial: "LAP002",
      manufacturer: "HP",
      model: "EliteBook 840",
      date: "2025-08-15",
      costCenterId: "CC1002",
      status: "Available",
      assignedTo: null,
    },
    {
      serial: "LAP003",
      manufacturer: "Lenovo",
      model: "ThinkPad X1",
      date: "2025-08-20",
      costCenterId: "CC1002",
      status: "Assigned",
      assignedTo: {
        employeeId: "EMP202",
        email: "emp202@nokia.com",
        lineManager: "Jane Manager",
        lineManagerId: "MGR002",
        costCenterId: "CC1002",
      },
    },
  ]);

  const [searchValue, setSearchValue] = useState("");
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Assign popup state
  const [assignPopup, setAssignPopup] = useState(null);
  const [assignDetails, setAssignDetails] = useState({
    employeeId: "",
    email: "",
    lineManager: "",
    lineManagerId: "",
  });

  // Return/Replace popup state
  const [returnPopup, setReturnPopup] = useState(null);
  const [returnReason, setReturnReason] = useState("");

  // Search handler
  const handleSearch = () => {
    const results = assets.filter(
      (asset) =>
        asset.costCenterId === searchValue ||
        asset.assignedTo?.employeeId === searchValue
    );
    setFilteredAssets(results);
  };

  // Handle Assign Save
  const handleAssignSave = () => {
    if (!assignDetails.employeeId || !assignDetails.email) {
      alert("Please fill Employee ID and Email");
      return;
    }

    setAssets(
      assets.map((asset) =>
        asset.serial === assignPopup.serial
          ? {
              ...asset,
              status: "Assigned",
              assignedTo: {
                ...assignDetails,
                costCenterId: assignPopup.costCenterId, // auto from asset
              },
            }
          : asset
      )
    );

    setAssignPopup(null);
    setAssignDetails({
      employeeId: "",
      email: "",
      lineManager: "",
      lineManagerId: "",
    });
  };

  // Submit return/replace request
  const handleReturnSubmit = (asset) => {
    if (!returnReason) {
      alert("Please provide a reason (max 50 words).");
      return;
    }
    alert(
      `Request submitted for ${asset.serial}: ${returnReason} (will go to Admin)`
    );
    setReturnReason("");
    setReturnPopup(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Team Asset Manager Dashboard</h1>
        <button className="bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200">
          Logout
        </button>
      </header>

      <div className="p-6 space-y-8">
        {/* Manager Details */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">My Details</h2>
          <p><strong>Name:</strong> {managerDetails.name}</p>
          <p><strong>Manager ID:</strong> {managerDetails.managerId}</p>
          <p><strong>Email:</strong> {managerDetails.email}</p>
          <p><strong>Manager Email:</strong> {managerDetails.managerEmail}</p>
          <p><strong>Cost Center ID:</strong> {managerDetails.costCenterId}</p>
        </div>

        {/* Search Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">
            Search Assets
          </h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Enter Cost Center ID or Employee ID"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border rounded-lg p-2 flex-grow"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
            >
              Search
            </button>
          </div>

          {filteredAssets.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-3">Serial No</th>
                  <th className="p-3">Manufacturer</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.serial} className="border-b">
                    <td className="p-3">{asset.serial}</td>
                    <td className="p-3">{asset.manufacturer}</td>
                    <td className="p-3">{asset.model}</td>
                    <td className="p-3">{asset.status}</td>
                    <td className="p-3">
                      {asset.assignedTo ? (
                        <button
                          onClick={() => setSelectedEmployee(asset.assignedTo)}
                          className="text-blue-700 underline"
                        >
                          {asset.assignedTo.employeeId}
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3">
                      {asset.status === "Available" ? (
                        <button
                          onClick={() => setAssignPopup(asset)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                        >
                          Assign
                        </button>
                      ) : (
                        <button
                          onClick={() => setReturnPopup(asset)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                        >
                          Return / Replace
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No results found. Please search.</p>
          )}
        </div>
      </div>

      {/* Employee Details Popup */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              Employee Details
            </h2>
            <p><strong>ID:</strong> {selectedEmployee.employeeId}</p>
            <p><strong>Email:</strong> {selectedEmployee.email}</p>
            <p><strong>Line Manager:</strong> {selectedEmployee.lineManager}</p>
            <p><strong>Line Manager ID:</strong> {selectedEmployee.lineManagerId}</p>
            <p><strong>Cost Center ID:</strong> {selectedEmployee.costCenterId}</p>
            <button
              onClick={() => setSelectedEmployee(null)}
              className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Assign Popup */}
      {assignPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              Assign Asset ({assignPopup.serial})
            </h2>
            <input
              type="text"
              placeholder="Employee ID"
              value={assignDetails.employeeId}
              onChange={(e) =>
                setAssignDetails({ ...assignDetails, employeeId: e.target.value })
              }
              className="border rounded-lg p-2 mb-2 w-full"
            />
            <input
              type="email"
              placeholder="Employee Email"
              value={assignDetails.email}
              onChange={(e) =>
                setAssignDetails({ ...assignDetails, email: e.target.value })
              }
              className="border rounded-lg p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Line Manager"
              value={assignDetails.lineManager}
              onChange={(e) =>
                setAssignDetails({ ...assignDetails, lineManager: e.target.value })
              }
              className="border rounded-lg p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Line Manager ID"
              value={assignDetails.lineManagerId}
              onChange={(e) =>
                setAssignDetails({ ...assignDetails, lineManagerId: e.target.value })
              }
              className="border rounded-lg p-2 mb-2 w-full"
            />
            <input
              type="text"
              value={assignPopup.costCenterId}
              disabled
              className="border rounded-lg p-2 mb-2 w-full bg-gray-100"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setAssignPopup(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSave}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return/Replace Popup */}
      {returnPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              Return / Replace Request
            </h2>
            <textarea
              placeholder="Enter reason (max 50 words)"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="border rounded-lg p-2 w-full mb-2"
              rows="3"
              maxLength={300}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReturnPopup(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReturnSubmit(returnPopup)}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamAssetManagerDashboard;
