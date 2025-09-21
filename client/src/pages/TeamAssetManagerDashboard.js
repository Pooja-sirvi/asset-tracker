
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
        name: "Alice Smith",
        employeeId: "EMP101",
        email: "emp101@nokia.com",
        lineManager: "John Manager",
        lineManagerId: "MGR001",
        costCenterId: "CC1001",
        lineManagerEmail: "john.manager@nokia.com",
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
        name: "Bob Johnson",
        employeeId: "EMP202",
        email: "emp202@nokia.com",
        lineManager: "Jane Manager",
        lineManagerId: "MGR002",
        costCenterId: "CC1002",
        lineManagerEmail: "jane.manager@nokia.com",
      },
    },
  ]);

  const [searchValue, setSearchValue] = useState("");
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [message, setMessage] = useState(null);

  // Assign popup state
  const [assignPopup, setAssignPopup] = useState(null);
  const [assignDetails, setAssignDetails] = useState({
    firstName: "",
    lastName: "",
    employeeId: "",
    email: "",
    lineManager: "",
    lineManagerId: "",
    lineManagerEmail: "",
  });

  // Return/Replace popup state
  const [requestPopup, setRequestPopup] = useState(null);
  const [requestReason, setRequestReason] = useState("");

  // Add New Asset popup state
  const [addAssetPopup, setAddAssetPopup] = useState(false);
  const [newAsset, setNewAsset] = useState({
    serial: "",
    manufacturer: "",
    model: "",
    costCenterId: "",
    date: "",
  });

  // Simple message box component to replace alerts
  const MessageBox = ({ message, type, onClose }) => {
    if (!message) return null;
    const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";
    return (
      <div
        className={`fixed top-4 right-4 p-4 rounded-xl shadow-lg text-white ${bgColor} z-50`}
      >
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button onClick={onClose} className="ml-4 font-bold">
            &times;
          </button>
        </div>
      </div>
    );
  };

  // Handler for adding a new asset
  const handleAddAssetSave = () => {
    if (
      !newAsset.serial ||
      !newAsset.manufacturer ||
      !newAsset.model ||
      !newAsset.costCenterId ||
      !newAsset.date
    ) {
      setMessage("Please fill all fields to add a new asset.");
      return;
    }
    const assetExists = assets.some((asset) => asset.serial === newAsset.serial);
    if (assetExists) {
      setMessage("Asset with this serial number already exists.");
      return;
    }
    setAssets([
      ...assets,
      { ...newAsset, status: "Available", assignedTo: null },
    ]);
    setAddAssetPopup(false);
    setNewAsset({
      serial: "",
      manufacturer: "",
      model: "",
      costCenterId: "",
      date: "",
    });
    setMessage("New asset added successfully!");
  };

  // Search handler
  const handleSearch = () => {
    const results = assets.filter(
      (asset) =>
        asset.costCenterId.toLowerCase().includes(searchValue.toLowerCase()) ||
        (asset.assignedTo &&
          asset.assignedTo.employeeId
            .toLowerCase()
            .includes(searchValue.toLowerCase()))
    );
    setFilteredAssets(results);
    if (results.length === 0) {
      setMessage("No assets found matching your search.");
    }
  };

  // Handle Assign Save
  const handleAssignSave = () => {
    if (!assignDetails.employeeId || !assignDetails.email) {
      setMessage("Please fill Employee ID and Email.");
      return;
    }

    const fullName = `${assignDetails.firstName} ${assignDetails.lastName}`.trim();

    setAssets(
      assets.map((asset) =>
        asset.serial === assignPopup.serial
          ? {
              ...asset,
              status: "Assigned",
              assignedTo: {
                name: fullName,
                employeeId: assignDetails.employeeId,
                email: assignDetails.email,
                lineManager: assignDetails.lineManager,
                lineManagerId: assignDetails.lineManagerId,
                lineManagerEmail: assignDetails.lineManagerEmail,
                costCenterId: assignPopup.costCenterId,
              },
            }
          : asset
      )
    );

    setAssignPopup(null);
    setAssignDetails({
      firstName: "",
      lastName: "",
      employeeId: "",
      email: "",
      lineManager: "",
      lineManagerId: "",
      lineManagerEmail: "",
    });
    setMessage(`Asset ${assignPopup.serial} assigned successfully!`);
  };

  // Submit return/replace request
  const handleSubmitRequest = (asset, type) => {
    const reasonWords = requestReason.trim().split(/\s+/).filter(Boolean).length;
    if (reasonWords > 25 || requestReason.trim().length === 0) {
      setMessage("Please provide a reason with a maximum of 25 words.");
      return;
    }
    setMessage(
      `${type} request for ${asset.serial} has been submitted. This request would typically be sent to an Admin.`
    );
    setRequestReason("");
    setRequestPopup(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800">
      <MessageBox
        message={message}
        onClose={() => setMessage(null)}
        type={message?.includes("Please fill") || message?.includes("No assets found") ? "error" : "success"}
      />

      {/* Header */}
      <header className="bg-blue-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-4">
          <img
            src="https://res.cloudinary.com/dki6axgft/image/upload/v1757611339/Nokia_logo_RGB-Bright_blue_mvdrlq.jpg"
            alt="Nokia Logo"
            className="h-10"
          />
          <h1 className="text-2xl font-bold">Team Asset Manager Dashboard</h1>
        </div>
        <button
          onClick={() => console.log("Logout clicked")}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="container mx-auto p-6 space-y-8">
        {/* Manager Details */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">My Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <p><strong>Name:</strong> {managerDetails.name}</p>
            <p><strong>Manager ID:</strong> {managerDetails.managerId}</p>
            <p><strong>Email:</strong> {managerDetails.email}</p>
            <p><strong>Manager Email:</strong> {managerDetails.managerEmail}</p>
            <p><strong>Cost Center ID:</strong> {managerDetails.costCenterId}</p>
          </div>
        </div>

        {/* Search & Actions + Table */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue-900">Asset Management</h2>
            <button
              onClick={() => setAddAssetPopup(true)}
              className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors"
            >
              Add New Asset
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
            <input
              type="text"
              placeholder="Enter Cost Center ID or Employee ID"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full sm:w-72 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-900 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-800 transition-colors"
            >
              Search
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="min-w-full border-collapse table-fixed text-left">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th className="p-3 w-32">Serial No</th>
                  <th className="p-3 w-36">Manufacturer</th>
                  <th className="p-3 w-48">Model</th>
                  <th className="p-3 w-32">Date</th>
                  <th className="p-3 w-32">Status</th>
                  <th className="p-3 w-36">Employee ID</th>
                  <th className="p-3 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length > 0
                  ? filteredAssets.map((asset) => (
                      <tr key={asset.serial} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="p-3 break-words">{asset.serial}</td>
                        <td className="p-3 break-words">{asset.manufacturer}</td>
                        <td className="p-3 break-words">{asset.model}</td>
                        <td className="p-3 break-words">{asset.date}</td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              asset.status === "Assigned"
                                ? "bg-red-200 text-red-800"
                                : "bg-green-200 text-green-800"
                            }`}
                          >
                            {asset.status}
                          </span>
                        </td>
                        <td className="p-3 break-words">
                          {asset.assignedTo ? (
                            <button
                              onClick={() => setSelectedEmployee(asset.assignedTo)}
                              className="text-blue-700 underline hover:no-underline"
                            >
                              {asset.assignedTo.employeeId}
                            </button>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-3 flex space-x-2">
                          {asset.status === "Available" ? (
                            <button
                              onClick={() => setAssignPopup(asset)}
                              className="bg-green-600 text-white font-semibold px-3 py-1 rounded-lg shadow-sm hover:bg-green-700 transition-colors"
                            >
                              Assign
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => setRequestPopup({ asset, type: 'Return' })}
                                className="bg-blue-600 text-white font-semibold px-3 py-1 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                              >
                                Return
                              </button>
                              <button
                                onClick={() => setRequestPopup({ asset, type: 'Replacement' })}
                                className="bg-yellow-600 text-white font-semibold px-3 py-1 rounded-lg shadow-sm hover:bg-yellow-700 transition-colors"
                              >
                                Replace
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  : assets.map((asset) => (
                      <tr key={asset.serial} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="p-3 break-words">{asset.serial}</td>
                        <td className="p-3 break-words">{asset.manufacturer}</td>
                        <td className="p-3 break-words">{asset.model}</td>
                        <td className="p-3 break-words">{asset.date}</td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              asset.status === "Assigned"
                                ? "bg-red-200 text-red-800"
                                : "bg-green-200 text-green-800"
                            }`}
                          >
                            {asset.status}
                          </span>
                        </td>
                        <td className="p-3 break-words">
                          {asset.assignedTo ? (
                            <button
                              onClick={() => setSelectedEmployee(asset.assignedTo)}
                              className="text-blue-700 underline hover:no-underline"
                            >
                              {asset.assignedTo.employeeId}
                            </button>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-3 flex space-x-2">
                          {asset.status === "Available" ? (
                            <button
                              onClick={() => setAssignPopup(asset)}
                              className="bg-green-600 text-white font-semibold px-3 py-1 rounded-lg shadow-sm hover:bg-green-700 transition-colors"
                            >
                              Assign
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => setRequestPopup({ asset, type: 'Return' })}
                                className="bg-blue-600 text-white font-semibold px-3 py-1 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                              >
                                Return
                              </button>
                              <button
                                onClick={() => setRequestPopup({ asset, type: 'Replacement' })}
                                className="bg-yellow-600 text-white font-semibold px-3 py-1 rounded-lg shadow-sm hover:bg-yellow-700 transition-colors"
                              >
                                Replace
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                {filteredAssets.length === 0 && searchValue && (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No results found for your search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Employee Details Popup */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-40">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm transform scale-100 transition-transform duration-300">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Employee Details</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedEmployee.name}</p>
              <p><strong>ID:</strong> {selectedEmployee.employeeId}</p>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Line Manager:</strong> {selectedEmployee.lineManager}</p>
              <p><strong>Line Manager ID:</strong> {selectedEmployee.lineManagerId}</p>
              <p><strong>Line Manager Email:</strong> {selectedEmployee.lineManagerEmail}</p>
              <p><strong>Cost Center ID:</strong> {selectedEmployee.costCenterId}</p>
            </div>
            <button
              onClick={() => setSelectedEmployee(null)}
              className="mt-6 w-full bg-blue-900 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Assign Popup */}
      {assignPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-40">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm transform scale-100 transition-transform duration-300">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              Assign Asset ({assignPopup.serial})
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="First Name"
                value={assignDetails.firstName}
                onChange={(e) =>
                  setAssignDetails({ ...assignDetails, firstName: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={assignDetails.lastName}
                onChange={(e) =>
                  setAssignDetails({ ...assignDetails, lastName: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Employee ID"
                value={assignDetails.employeeId}
                onChange={(e) =>
                  setAssignDetails({ ...assignDetails, employeeId: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Employee Email"
                value={assignDetails.email}
                onChange={(e) =>
                  setAssignDetails({ ...assignDetails, email: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Line Manager"
                value={assignDetails.lineManager}
                onChange={(e) =>
                  setAssignDetails({ ...assignDetails, lineManager: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Line Manager ID"
                value={assignDetails.lineManagerId}
                onChange={(e) =>
                  setAssignDetails({ ...assignDetails, lineManagerId: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Line Manager Email"
                value={assignDetails.lineManagerEmail}
                onChange={(e) =>
                  setAssignDetails({
                    ...assignDetails,
                    lineManagerEmail: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={`Cost Center: ${assignPopup.costCenterId}`}
                disabled
                className="border border-gray-300 rounded-lg p-2 w-full bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setAssignPopup(null)}
                className="bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSave}
                className="bg-blue-900 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-800 transition-colors"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return/Replace Popup */}
      {requestPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-40">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm transform scale-100 transition-transform duration-300">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              {requestPopup.type} Request
            </h2>
            <textarea
              placeholder="Enter reason (max 25 words)"
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-4 resize-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              maxLength={150} // Approximate character limit for 25 words
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRequestPopup(null)}
                className="bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitRequest(requestPopup.asset, requestPopup.type)}
                className="bg-blue-900 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-800 transition-colors"
              >
                Submit {requestPopup.type}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Asset Popup */}
      {addAssetPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-40">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm transform scale-100 transition-transform duration-300">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Add New Asset</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Serial Number"
                value={newAsset.serial}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, serial: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Manufacturer"
                value={newAsset.manufacturer}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, manufacturer: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Model"
                value={newAsset.model}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, model: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Cost Center ID"
                value={newAsset.costCenterId}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, costCenterId: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                placeholder="Date"
                value={newAsset.date}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, date: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setAddAssetPopup(false)}
                className="bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAssetSave}
                className="bg-blue-900 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-800 transition-colors"
              >
                Add Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamAssetManagerDashboard;
