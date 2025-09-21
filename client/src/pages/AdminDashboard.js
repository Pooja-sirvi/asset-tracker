import React, { useState } from "react";

// A custom message box component
const MessageBox = ({ title, message, onClose, isPrompt, onSubmit, placeholder, value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || "");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-xl flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4 text-blue-800 text-center">{title}</h2>
        <p className="mb-4 text-gray-600 text-center">{message}</p>
        {isPrompt && (
          <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-xl p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        <div className="flex justify-end gap-3 mt-4 w-full">
          {onSubmit && (
            <button
              onClick={() => onSubmit(inputValue)}
              className="bg-blue-800 text-white font-medium px-6 py-3 rounded-xl hover:scale-105 hover:bg-blue-900"
            >
              Confirm
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-400 text-white font-medium px-6 py-3 rounded-xl hover:scale-105 hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================
// Main Admin Dashboard
// =========================
const AdminDashboard = () => {
  // Dummy Admin Details
  const adminDetails = {
    name: "Admin User",
    adminId: "ADM001",
    email: "admin@nokia.com",
    role: "System Admin",
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
        firstName: "Alice",
        lastName: "Smith",
        employeeId: "EMP101",
        email: "alice.smith@nokia.com",
        lineManagerId: "MGR001",
        lineManagerEmail: "john.manager@nokia.com",
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
  ]);

  // Requests
  const [requests, setRequests] = useState([
    { serial: "LAP004", manufacturer: "Dell", model: "XPS 15", employeeId: "EMP202", reason: "System heating issues", date: "2025-10-25" },
    { serial: "LAP005", manufacturer: "Apple", model: "MacBook Pro", employeeId: "EMP303", reason: "Screen flickering issues", date: "2025-10-24" },
  ]);

  const [history, setHistory] = useState([]);
  const [costCenterData, setCostCenterData] = useState([]); // Empty array as the table is removed

  // UI States
  const [searchValue, setSearchValue] = useState("");
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [assignPopup, setAssignPopup] = useState(null);
  const [assignDetails, setAssignDetails] = useState({ firstName: "", lastName: "", employeeId: "", email: "", lineManagerId: "", lineManagerEmail: "" });
  const [editEmployee, setEditEmployee] = useState(null);
  const [deletePopup, setDeletePopup] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [rejectPopup, setRejectPopup] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonCharCount, setRejectReasonCharCount] = useState(0);
  const [newAsset, setNewAsset] = useState({ serial: "", manufacturer: "", model: "", costCenterId: "", date: "" });
  const [showHistory, setShowHistory] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [costCenterPrompt, setCostCenterPrompt] = useState(null);
  const [messageBoxState, setMessageBoxState] = useState({ show: false, title: "", message: "" });
  const [newCostCenterId, setNewCostCenterId] = useState("");

  // Helpers
  const showMessageBox = (title, message) => setMessageBoxState({ show: true, title, message });

  // === Handlers (assign, edit, delete, approve/reject, etc.) ===
  const handleSearch = () => {
    const results = assets.filter(
      (asset) =>
        asset.costCenterId.toLowerCase().includes(searchValue.toLowerCase()) ||
        asset.assignedTo?.employeeId?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredAssets(results);
  };

  const handleAssignSave = () => {
    if (!assignDetails.firstName || !assignDetails.lastName || !assignDetails.employeeId || !assignDetails.email) {
      showMessageBox("Missing Information", "Please fill all required fields.");
      return;
    }
    setAssets(
      assets.map((asset) =>
        asset.serial === assignPopup.serial
          ? { ...asset, status: "Assigned", assignedTo: { ...assignDetails, name: `${assignDetails.firstName} ${assignDetails.lastName}`, costCenterId: assignPopup.costCenterId } }
          : asset
      )
    );
    setAssignPopup(null);
  };

  const handleEditSave = () => {
    setAssets(assets.map((asset) => (asset.assignedTo?.employeeId === editEmployee.employeeId ? { ...asset, assignedTo: editEmployee } : asset)));
    setEditEmployee(null);
  };

  const handleAddAsset = () => {
    if (!newAsset.serial || !newAsset.manufacturer || !newAsset.model || !newAsset.costCenterId) {
      showMessageBox("Missing Information", "Please fill all fields.");
      return;
    }
    setAssets([...assets, { ...newAsset, status: "Available", assignedTo: null }]);
    setNewAsset({ serial: "", manufacturer: "", model: "", costCenterId: "", date: "" });
  };

  const handleDeleteConfirm = (asset) => {
    const words = deleteReason.trim().split(/\s+/).filter(Boolean).length;
    if (words > 25 || words === 0) {
      showMessageBox("Invalid Reason", "Please provide a reason (max 25 words).");
      return;
    }
    setHistory([...history, { ...asset, status: "Deleted", deleteReason, deleteDate: new Date().toISOString().split("T")[0] }]);
    setAssets(assets.filter((a) => a.serial !== asset.serial));
    setDeletePopup(null);
    setDeleteReason("");
  };

  const handleApprove = (req) => {
    setAssets([...assets, { serial: req.serial, manufacturer: req.manufacturer, model: req.model, date: req.date, costCenterId: req.costCenterId || "CC1001", status: "Available", assignedTo: null }]);
    setRequests(requests.filter((r) => r.serial !== req.serial));
  };

  const handleReject = (req) => {
    const words = rejectReason.trim().split(/\s+/).filter(Boolean).length;
    if (words > 25 || words === 0) {
      showMessageBox("Invalid Reason", "Please provide a reason (max 25 words).");
      return;
    }
    setRequests(requests.filter((r) => r.serial !== req.serial));
    setRejectPopup(null);
    setRejectReason("");
  };

  const handleCostCenterUpload = () => {
    if (!uploadFile) {
      showMessageBox("No file selected", "Please select an Excel file to upload.");
      return;
    }
    if (!newCostCenterId) {
      showMessageBox("Missing Information", "Please enter a Cost Center ID.");
      return;
    }
    // Simulate upload and adding to data
    const newId = newCostCenterId;
    setCostCenterData([...costCenterData, { id: newId, location: "New Location", budget: "New Budget" }]);
    showMessageBox("Upload Successful", `Excel data for Cost Center ${newId} has been processed.`);
    setUploadFile(null);
    setNewCostCenterId("");
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="p-6 bg-gray-100 min-h-screen font-inter">
      {/* Header */}
      <header className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          {/* Using a different source for the Nokia logo that renders correctly */}
          <img src="https://assets.nokia.com/brand-center/nokia_wordmark.svg" alt="Nokia Logo" className="h-6" />
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <button onClick={() => showMessageBox("Logout", "Redirecting to login page...")} className="bg-red-600 text-white px-4 py-2 rounded-xl hover:scale-105">
          Logout
        </button>
      </header>

      <div className="space-y-8 mt-6">
        {/* Admin Details */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">My Details</h2>
          <p><strong>Name:</strong> {adminDetails.name}</p>
          <p><strong>Admin ID:</strong> {adminDetails.adminId}</p>
          <p><strong>Email:</strong> {adminDetails.email}</p>
          <p><strong>Role:</strong> {adminDetails.role}</p>
        </div>

        {/* Add Asset */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Add New Asset</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <input type="text" placeholder="Serial Number" value={newAsset.serial} onChange={(e) => setNewAsset({ ...newAsset, serial: e.target.value })} className="border p-3 rounded-xl" />
            <input type="text" placeholder="Manufacturer" value={newAsset.manufacturer} onChange={(e) => setNewAsset({ ...newAsset, manufacturer: e.target.value })} className="border p-3 rounded-xl" />
            <input type="text" placeholder="Model" value={newAsset.model} onChange={(e) => setNewAsset({ ...newAsset, model: e.target.value })} className="border p-3 rounded-xl" />
            <input type="text" placeholder="Cost Center ID" value={newAsset.costCenterId} onChange={(e) => setNewAsset({ ...newAsset, costCenterId: e.target.value })} className="border p-3 rounded-xl" />
            <input type="date" value={newAsset.date} onChange={(e) => setNewAsset({ ...newAsset, date: e.target.value })} className="border p-3 rounded-xl" />
          </div>
          <button onClick={handleAddAsset} className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl hover:scale-105">Add Asset</button>
        </div>

        {/* Search & Manage Assets */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Search & Manage Assets</h2>
          <div className="flex gap-4 mb-4">
            <input type="text" placeholder="Enter Cost Center ID or Employee ID" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="border p-3 rounded-xl w-72" />
            <button onClick={handleSearch} className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:scale-105">Search</button>
          </div>
          {filteredAssets.length > 0 && (
            <table className="w-full border-collapse text-left">
              <thead className="bg-gray-200">
                <tr><th className="p-3">Serial</th><th className="p-3">Manufacturer</th><th className="p-3">Model</th><th className="p-3">Status</th><th className="p-3">Employee ID</th><th className="p-3">Actions</th></tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.serial} className="border-b">
                    <td className="p-3">{asset.serial}</td>
                    <td className="p-3">{asset.manufacturer}</td>
                    <td className="p-3">{asset.model}</td>
                    <td className="p-3">{asset.status}</td>
                    <td className="p-3">{asset.assignedTo ? <button onClick={() => setEditEmployee(asset.assignedTo)} className="text-blue-700 underline">{asset.assignedTo.employeeId}</button> : "—"}</td>
                    <td className="p-3">
                      {asset.status === "Available" ? (
                        <button onClick={() => setAssignPopup(asset)} className="bg-green-600 text-white px-3 py-1 rounded-lg">Assign</button>
                      ) : (
                        <button onClick={() => setDeletePopup(asset)} className="bg-red-600 text-white px-3 py-1 rounded-lg">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Requests */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Pending Requests</h2>
          {requests.length > 0 ? (
            <table className="w-full border-collapse text-left">
              <thead className="bg-gray-200">
                <tr><th className="p-3">Serial</th><th className="p-3">Employee ID</th><th className="p-3">Reason</th><th className="p-3">Actions</th></tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.serial} className="border-b">
                    <td className="p-3">{req.serial}</td>
                    <td className="p-3">{req.employeeId}</td>
                    <td className="p-3">{req.reason}</td>
                    <td className="p-3">
                      <button onClick={() => handleApprove(req)} className="bg-green-600 text-white px-3 py-1 rounded-lg mr-2">Approve</button>
                      <button onClick={() => setRejectPopup(req)} className="bg-red-600 text-white px-3 py-1 rounded-lg">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-gray-500">No pending requests.</p>}
        </div>

        {/* History */}
        <div>
          <button onClick={() => setShowHistory(!showHistory)} className="bg-gray-600 text-white px-6 py-3 rounded-xl">{showHistory ? "Hide History" : "View Deleted History"}</button>
        </div>
        {showHistory && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Deleted Asset History</h2>
            {history.length > 0 ? (
              <table className="w-full border-collapse text-left">
                <thead className="bg-gray-200"><tr><th className="p-3">Serial</th><th className="p-3">Manufacturer</th><th className="p-3">Model</th><th className="p-3">Date Deleted</th><th className="p-3">Reason</th></tr></thead>
                <tbody>{history.map((h) => <tr key={h.serial}><td className="p-3">{h.serial}</td><td className="p-3">{h.manufacturer}</td><td className="p-3">{h.model}</td><td className="p-3">{h.deleteDate}</td><td className="p-3">{h.deleteReason}</td></tr>)}</tbody>
              </table>
            ) : <p className="text-gray-500">No assets deleted yet.</p>}
          </div>
        )}

        {/* Data Management */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Upload Data</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="text"
              placeholder="Enter Cost Center ID"
              value={newCostCenterId}
              onChange={(e) => setNewCostCenterId(e.target.value)}
              className="border p-3 rounded-xl w-full sm:w-64"
            />
            <label className="bg-gray-200 rounded-xl px-4 py-2 cursor-pointer w-full sm:w-auto text-center">
              <input
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="hidden"
                accept=".xlsx, .xls"
              />
              <span>{uploadFile ? `Selected: ${uploadFile.name}` : "Select Excel File"}</span>
            </label>
            <button
              onClick={handleCostCenterUpload}
              disabled={!uploadFile || !newCostCenterId}
              className={`px-6 py-3 rounded-xl text-white w-full sm:w-auto ${(!uploadFile || !newCostCenterId) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:scale-105'}`}
            >
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* Popups */}
      {assignPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Assign Asset: {assignPopup.serial}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" value={assignDetails.firstName} onChange={(e) => setAssignDetails({ ...assignDetails, firstName: e.target.value })} className="border p-3 rounded-xl" />
              <input type="text" placeholder="Last Name" value={assignDetails.lastName} onChange={(e) => setAssignDetails({ ...assignDetails, lastName: e.target.value })} className="border p-3 rounded-xl" />
              <input type="text" placeholder="Employee ID" value={assignDetails.employeeId} onChange={(e) => setAssignDetails({ ...assignDetails, employeeId: e.target.value })} className="border p-3 rounded-xl" />
              <input type="email" placeholder="Employee Email" value={assignDetails.email} onChange={(e) => setAssignDetails({ ...assignDetails, email: e.target.value })} className="border p-3 rounded-xl" />
              <input type="text" placeholder="Line Manager ID" value={assignDetails.lineManagerId} onChange={(e) => setAssignDetails({ ...assignDetails, lineManagerId: e.target.value })} className="border p-3 rounded-xl" />
              <input type="email" placeholder="Line Manager Email" value={assignDetails.lineManagerEmail} onChange={(e) => setAssignDetails({ ...assignDetails, lineManagerEmail: e.target.value })} className="border p-3 rounded-xl" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setAssignPopup(null)} className="bg-gray-400 text-white px-6 py-3 rounded-xl">Cancel</button>
              <button onClick={handleAssignSave} className="bg-blue-800 text-white px-6 py-3 rounded-xl">Assign</button>
            </div>
          </div>
        </div>
      )}

      {deletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-red-700">Confirm Deletion</h2>
            <textarea rows="3" value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} className="border p-3 w-full rounded-xl" />
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDeletePopup(null)} className="bg-gray-400 text-white px-6 py-3 rounded-xl">Cancel</button>
              <button onClick={() => handleDeleteConfirm(deletePopup)} className="bg-red-600 text-white px-6 py-3 rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}

      {rejectPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-red-700">Reject Request</h2>
            <textarea rows="3" value={rejectReason} onChange={(e) => { setRejectReason(e.target.value); setRejectReasonCharCount(e.target.value.trim().split(/\s+/).filter(Boolean).length); }} className="border p-3 w-full rounded-xl" />
            <p className="text-right text-sm">{rejectReasonCharCount} / 25 words</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setRejectPopup(null)} className="bg-gray-400 text-white px-6 py-3 rounded-xl">Cancel</button>
              <button onClick={() => handleReject(rejectPopup)} className="bg-red-600 text-white px-6 py-3 rounded-xl">Reject</button>
            </div>
          </div>
        </div>
      )}

      {messageBoxState.show && (
        <MessageBox title={messageBoxState.title} message={messageBoxState.message} onClose={() => setMessageBoxState({ show: false, title: "", message: "" })} />
      )}
    </div>
  );
};

export default AdminDashboard;