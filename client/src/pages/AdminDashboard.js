import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Building,
  Laptop,
  Search,
  Plus,
  XCircle,
  Package,
  ClipboardList,
  History,
  Clock,
  CircleArrowLeft,
} from "lucide-react";

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
  const navigate = useNavigate();

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
    {
      serial: "LAP003",
      manufacturer: "Lenovo",
      model: "ThinkPad X1",
      date: "2025-08-20",
      costCenterId: "CC1002",
      status: "Assigned",
      assignedTo: {
        firstName: "Bob",
        lastName: "Johnson",
        employeeId: "EMP202",
        email: "bob.johnson@nokia.com",
        lineManagerId: "MGR002",
        lineManagerEmail: "jane.manager@nokia.com",
        costCenterId: "CC1002",
      },
    },
    {
      serial: "LAP004",
      manufacturer: "Dell",
      model: "XPS 15",
      date: "2025-09-10",
      costCenterId: "CC1003",
      status: "Available",
      assignedTo: null,
    },
    {
      serial: "LAP005",
      manufacturer: "Microsoft",
      model: "Surface Laptop 4",
      date: "2025-07-25",
      costCenterId: "CC1003",
      status: "Assigned",
      assignedTo: {
        firstName: "Charlie",
        lastName: "Brown",
        employeeId: "EMP303",
        email: "charlie.brown@nokia.com",
        lineManagerId: "MGR001",
        costCenterId: "CC1003",
        lineManagerEmail: "john.manager@nokia.com",
      },
    },
    {
      serial: "LAP006",
      manufacturer: "Apple",
      model: "MacBook Pro",
      date: "2025-06-12",
      costCenterId: "CC1004",
      status: "Available",
      assignedTo: null,
    },
  ]);

  // Requests
  const [requests, setRequests] = useState([
    { serial: "LAP004", manufacturer: "Dell", model: "XPS 15", employeeId: "EMP202", reason: "System heating issues", date: "2025-10-25", type: "Replacement" },
    { serial: "LAP005", manufacturer: "Apple", model: "MacBook Pro", employeeId: "EMP303", reason: "Screen flickering issues", date: "2025-10-24", type: "Return" },
    { serial: "LAP006", manufacturer: "Apple", model: "MacBook Pro", employeeId: "EMP404", reason: "Employee left the company", date: "2025-10-25", type: "Return" },
  ]);

  const [history, setHistory] = useState([]);
  const [returnedAssets, setReturnedAssets] = useState([
    { serial: "LAP007", manufacturer: "Acer", model: "Aspire 5", date: "2025-05-10", costCenterId: "CC1001", status: "Returned", assignedTo: null },
  ]);

  // UI States
  const [searchValue, setSearchValue] = useState("");
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [assetsToShow] = useState(3);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [assignPopup, setAssignPopup] = useState(null);
  const [assignDetails, setAssignDetails] = useState({ firstName: "", lastName: "", employeeId: "", email: "", lineManagerId: "", lineManagerEmail: "" });
  const [reissuePopup, setReissuePopup] = useState(null);
  const [reissueDetails, setReissueDetails] = useState({ firstName: "", lastName: "", employeeId: "", email: "", lineManager: "", lineManagerId: "", lineManagerEmail: "", costCenterId: "" });
  const [deletePopup, setDeletePopup] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [rejectPopup, setRejectPopup] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonCharCount, setRejectReasonCharCount] = useState(0);
  const [addAssetPopup, setAddAssetPopup] = useState(false);
  const [newAsset, setNewAsset] = useState({ serial: "", manufacturer: "", model: "", costCenterId: "", date: "" });
  const [showHistory, setShowHistory] = useState(false);
  
  // Updated state for message box
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState({ title: "", message: "" });
  
  // Fix: isViewingAll state variable
  const [isViewingAll, setIsViewingAll] = useState(false);
  const [showReturnedAssets, setShowReturnedAssets] = useState(false);

  // Helpers
  const showMessage = (title, message) => {
    setMessageBoxContent({ title, message });
    setShowMessageBox(true);
  };
  const hideMessage = () => setShowMessageBox(false);

  // === Handlers (assign, edit, delete, approve/reject, etc.) ===
  const handleSearch = () => {
    const results = assets.filter(
      (asset) =>
        asset.costCenterId.toLowerCase().includes(searchValue.toLowerCase()) ||
        asset.assignedTo?.employeeId?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredAssets(results);
    setIsViewingAll(true);
  };

  const handleAssignSave = () => {
    if (!assignDetails.firstName || !assignDetails.lastName || !assignDetails.employeeId || !assignDetails.email) {
      showMessage("Missing Information", "Please fill all required fields.");
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
    showMessage("Asset Assigned", `Asset ${assignPopup.serial} has been assigned.`);
  };

  const handleReissueSave = () => {
    if (!reissueDetails.employeeId || !reissueDetails.firstName || !reissueDetails.lastName || !reissueDetails.email || !reissueDetails.costCenterId || !reissueDetails.lineManagerEmail) {
      showMessage("Missing Information", "Please fill all mandatory fields.");
      return;
    }
    const reissuedAsset = returnedAssets.find(a => a.serial === reissuePopup.serial);
    if (reissuedAsset) {
      const updatedAsset = {
        ...reissuedAsset,
        status: "Assigned",
        assignedTo: {
          firstName: reissueDetails.firstName,
          lastName: reissueDetails.lastName,
          name: `${reissueDetails.firstName} ${reissueDetails.lastName}`,
          employeeId: reissueDetails.employeeId,
          email: reissueDetails.email,
          lineManager: reissueDetails.lineManager,
          lineManagerId: reissueDetails.lineManagerId,
          lineManagerEmail: reissueDetails.lineManagerEmail,
          costCenterId: reissueDetails.costCenterId
        }
      };
      setAssets([...assets, updatedAsset]);
      setReturnedAssets(returnedAssets.filter(a => a.serial !== reissuePopup.serial));
      setReissuePopup(null);
      showMessage("Reissue Successful", `Asset ${reissuedAsset.serial} has been successfully reissued.`);
    }
  };

  const handleAddAssetSave = () => {
    if (!newAsset.serial || !newAsset.manufacturer || !newAsset.model || !newAsset.costCenterId) {
      showMessage("Missing Information", "Please fill all fields.");
      return;
    }
    setAssets([...assets, { ...newAsset, status: "Available", assignedTo: null }]);
    setNewAsset({ serial: "", manufacturer: "", model: "", costCenterId: "", date: "" });
    setAddAssetPopup(false);
    showMessage("Asset Added", "New asset has been added successfully.");
  };

  const handleDeleteConfirm = (asset) => {
    const words = deleteReason.trim().split(/\s+/).filter(Boolean).length;
    if (words > 25 || words === 0) {
      showMessage("Invalid Reason", "Please provide a reason (max 25 words).");
      return;
    }
    setHistory([...history, { ...asset, status: "Deleted", deleteReason, deleteDate: new Date().toISOString().split("T")[0] }]);
    setAssets(assets.filter((a) => a.serial !== asset.serial));
    setDeletePopup(null);
    setDeleteReason("");
    showMessage("Asset Deleted", `Asset ${asset.serial} has been deleted.`);
  };

  const handleApprove = (req) => {
    if (req.type === 'Return') {
      const assetToReturn = assets.find(a => a.serial === req.serial);
      if (assetToReturn) {
        setReturnedAssets([...returnedAssets, { ...assetToReturn, status: 'Returned', assignedTo: null }]);
        setAssets(assets.filter(a => a.serial !== req.serial));
      }
    } else { // Replacement
      setAssets([...assets, { serial: req.serial, manufacturer: req.manufacturer, model: req.model, date: req.date, costCenterId: req.costCenterId || "CC1001", status: "Available", assignedTo: null }]);
    }
    setRequests(requests.filter((r) => r.serial !== req.serial));
    showMessage("Request Approved", `Request for ${req.serial} has been approved.`);
  };

  const handleReject = (req) => {
    const words = rejectReason.trim().split(/\s+/).filter(Boolean).length;
    if (words > 25 || words === 0) {
      showMessage("Invalid Reason", "Please provide a reason (max 25 words).");
      return;
    }
    setRequests(requests.filter((r) => r.serial !== req.serial));
    setRejectPopup(null);
    setRejectReason("");
    showMessage("Request Rejected", `Request for ${req.serial} has been rejected.`);
  };

  // Determine which assets to display
  const assetsToDisplay = isViewingAll ? (filteredAssets.length > 0 ? filteredAssets : assets) : assets.slice(0, assetsToShow);
  const showViewMore = assetsToShow < assets.length && filteredAssets.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
      {showMessageBox && (
        <MessageBox title={messageBoxContent.title} message={messageBoxContent.message} onClose={hideMessage} />
      )}

      {/* Header with Code-Based Nokia Logo */}
      <header className="bg-blue-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-4">
          <div
            className="text-3xl font-bold"
            style={{ letterSpacing: '0.1em' }}
          >
            NOKIA
          </div>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="container mx-auto p-6 space-y-8">
        {/* Main Dashboard Card with Integrated Sections */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          
          {/* My Details Section */}
          <h2 className="text-xl font-semibold mb-6 text-blue-900 flex items-center gap-2">
            <User size={24} /> My Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 pb-6">
            <div className="flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              <p><strong>Name:</strong> {adminDetails.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardList size={18} className="text-blue-500" />
              <p><strong>Admin ID:</strong> {adminDetails.adminId}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-blue-500" />
              <p><strong>Email:</strong> {adminDetails.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Building size={18} className="text-blue-500" />
              <p><strong>Role:</strong> {adminDetails.role}</p>
            </div>
          </div>
          
          <hr className="my-6 border-gray-200" />

          {/* Asset Management Section */}
          <h2 className="text-xl font-semibold mb-6 text-blue-900 flex items-center gap-2">
            <Laptop size={24} /> Asset Management
          </h2>
          {/* Unified Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Enter ID..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="border border-gray-300 rounded-lg pl-10 pr-2 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-900 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-800 transition-colors w-full sm:w-auto"
            >
              Search
            </button>
            <button
              onClick={() => setAddAssetPopup(true)}
              className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus size={20} /> Add New Asset
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
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
                {assetsToDisplay.map((asset) => (
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
                          className="bg-green-600 text-white font-semibold px-3 py-1 rounded-lg shadow-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <Plus size={16} /> Assign
                        </button>
                      ) : (
                        <button onClick={() => setDeletePopup(asset)} className="bg-red-600 text-white px-3 py-1 rounded-lg">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {assetsToDisplay.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No assets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* View More/View Less Buttons */}
          <div className="flex justify-center items-center mt-6">
            {showViewMore && (
              <button
                onClick={() => setIsViewingAll(true)}
                className="bg-blue-900 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-blue-800 transition-colors"
              >
                View All Assets
              </button>
            )}
            {isViewingAll && !showViewMore && (
              <button
                onClick={() => setIsViewingAll(false)}
                className="bg-blue-900 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-blue-800 transition-colors"
              >
                Show Less
              </button>
            )}
          </div>
        </div>

        {/* New Sections */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-900 flex items-center gap-2">
            <Clock size={24} /> Pending Requests
          </h2>
          {requests.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
              <table className="min-w-full border-collapse text-left">
                <thead className="bg-blue-100 text-blue-900">
                  <tr>
                    <th className="p-3">Serial</th>
                    <th className="p-3">Employee ID</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.serial} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="p-3">{req.serial}</td>
                      <td className="p-3">{req.employeeId}</td>
                      <td className="p-3">{req.reason}</td>
                      <td className="p-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${req.type === 'Return' ? 'bg-orange-200 text-orange-800' : 'bg-red-200 text-red-800'}`}>
                          {req.type}
                        </span>
                      </td>
                      <td className="p-3 flex space-x-2">
                        <button onClick={() => handleApprove(req)} className="bg-green-600 text-white px-3 py-1 rounded-lg">Approve</button>
                        <button onClick={() => setRejectPopup(req)} className="bg-red-600 text-white px-3 py-1 rounded-lg">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-gray-500">No pending requests.</p>}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <button 
            onClick={() => setShowReturnedAssets(!showReturnedAssets)}
            className="text-xl font-semibold mb-4 text-blue-900 flex items-center gap-2"
          >
            <CircleArrowLeft size={24} /> Returned Assets
          </button>
          {showReturnedAssets && (
            returnedAssets.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm mt-4">
                <table className="min-w-full border-collapse text-left">
                  <thead className="bg-blue-100 text-blue-900">
                    <tr>
                      <th className="p-3">Serial</th>
                      <th className="p-3">Manufacturer</th>
                      <th className="p-3">Model</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnedAssets.map((asset) => (
                      <tr key={asset.serial} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="p-3">{asset.serial}</td>
                        <td className="p-3">{asset.manufacturer}</td>
                        <td className="p-3">{asset.model}</td>
                        <td className="p-3">
                          <button onClick={() => setReissuePopup(asset)} className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-1">
                            <Package size={16} /> Reissue
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-gray-500 mt-4">No assets pending reissue.</p>
          )}
        </div>

        <div>
          <button onClick={() => setShowHistory(!showHistory)} className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors">
            {showHistory ? "Hide History" : "View Deleted History"}
          </button>
        </div>
        {showHistory && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-900 flex items-center gap-2"><History size={24} /> Deleted Asset History</h2>
            {history.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-gray-100"><tr><th className="p-3">Serial</th><th className="p-3">Manufacturer</th><th className="p-3">Model</th><th className="p-3">Date Deleted</th><th className="p-3">Reason</th></tr></thead>
                  <tbody>{history.map((h) => <tr key={h.serial} className="border-b border-gray-200"><td className="p-3">{h.serial}</td><td className="p-3">{h.manufacturer}</td><td className="p-3">{h.model}</td><td className="p-3">{h.deleteDate}</td><td className="p-3">{h.deleteReason}</td></tr>)}</tbody>
                </table>
              </div>
            ) : <p className="text-gray-500">No assets deleted yet.</p>}
          </div>
        )}
      </div>

      {/* Popups */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-40 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm transform scale-100 transition-transform duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-900">Employee Details</h2>
              <button onClick={() => setSelectedEmployee(null)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><User size={18} className="text-blue-500" /> <p><strong>Name:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}</p></div>
              <div className="flex items-center gap-2"><ClipboardList size={18} className="text-blue-500" /> <p><strong>ID:</strong> {selectedEmployee.employeeId}</p></div>
              <div className="flex items-center gap-2"><Mail size={18} className="text-blue-500" /> <p><strong>Email:</strong> {selectedEmployee.email}</p></div>
              <div className="flex items-center gap-2"><User size={18} className="text-blue-500" /> <p><strong>Line Manager ID:</strong> {selectedEmployee.lineManagerId}</p></div>
              <div className="flex items-center gap-2"><Mail size={18} className="text-blue-500" /> <p><strong>Line Manager Email:</strong> {selectedEmployee.lineManagerEmail}</p></div>
              <div className="flex items-center gap-2"><Building size={18} className="text-blue-500" /> <p><strong>Cost Center ID:</strong> {selectedEmployee.costCenterId}</p></div>
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

      {assignPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-800">Assign Asset: {assignPopup.serial}</h2>
              <button onClick={() => setAssignPopup(null)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>
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

      {reissuePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-800">Reissue Asset: {reissuePopup.serial}</h2>
              <button onClick={() => setReissuePopup(null)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Employee First Name" value={reissueDetails.firstName} onChange={(e) => setReissueDetails({ ...reissueDetails, firstName: e.target.value })} className="border p-3 rounded-xl" />
              <input type="text" placeholder="Employee Last Name" value={reissueDetails.lastName} onChange={(e) => setReissueDetails({ ...reissueDetails, lastName: e.target.value })} className="border p-3 rounded-xl" />
              <input type="text" placeholder="Employee ID" value={reissueDetails.employeeId} onChange={(e) => setReissueDetails({ ...reissueDetails, employeeId: e.target.value })} className="border p-3 rounded-xl" />
              <input type="email" placeholder="Employee Email" value={reissueDetails.email} onChange={(e) => setReissueDetails({ ...reissueDetails, email: e.target.value })} className="border p-3 rounded-xl" />
              <input type="text" placeholder="Cost Center" value={reissueDetails.costCenterId} onChange={(e) => setReissueDetails({ ...reissueDetails, costCenterId: e.target.value })} className="border p-3 rounded-xl" />
              <input type="text" placeholder="Line Manager" value={reissueDetails.lineManager} onChange={(e) => setReissueDetails({ ...reissueDetails, lineManager: e.target.value })} className="border p-3 rounded-xl" />
              <input type="text" placeholder="Line Manager ID" value={reissueDetails.lineManagerId} onChange={(e) => setReissueDetails({ ...reissueDetails, lineManagerId: e.target.value })} className="border p-3 rounded-xl" />
              <input type="email" placeholder="Line Manager Email" value={reissueDetails.lineManagerEmail} onChange={(e) => setReissueDetails({ ...reissueDetails, lineManagerEmail: e.target.value })} className="border p-3 rounded-xl" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setReissuePopup(null)} className="bg-gray-400 text-white px-6 py-3 rounded-xl">Cancel</button>
              <button onClick={handleReissueSave} className="bg-blue-800 text-white px-6 py-3 rounded-xl">Reissue</button>
            </div>
          </div>
        </div>
      )}

      {deletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-red-700">Confirm Deletion</h2>
              <button onClick={() => setDeletePopup(null)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>
            <textarea rows="3" value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} className="border p-3 w-full rounded-xl" placeholder="Reason for deletion..."/>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDeletePopup(null)} className="bg-gray-400 text-white px-6 py-3 rounded-xl">Cancel</button>
              <button onClick={() => handleDeleteConfirm(deletePopup)} className="bg-red-600 text-white px-6 py-3 rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}

      {rejectPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-red-700">Reject Request</h2>
              <button onClick={() => setRejectPopup(null)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>
            <textarea rows="3" value={rejectReason} onChange={(e) => { setRejectReason(e.target.value); setRejectReasonCharCount(e.target.value.trim().split(/\s+/).filter(Boolean).length); }} className="border p-3 w-full rounded-xl" placeholder="Reason for rejection..."/>
            <p className="text-right text-sm">{rejectReasonCharCount} / 25 words</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setRejectPopup(null)} className="bg-gray-400 text-white px-6 py-3 rounded-xl">Cancel</button>
              <button onClick={() => handleReject(rejectPopup)} className="bg-red-600 text-white px-6 py-3 rounded-xl">Reject</button>
            </div>
          </div>
        </div>
      )}
      
      {addAssetPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-800">Add New Asset</h2>
              <button onClick={() => setAddAssetPopup(false)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Serial Number" value={newAsset.serial} onChange={(e) => setNewAsset({ ...newAsset, serial: e.target.value })} className="border p-3 rounded-xl w-full" />
              <input type="text" placeholder="Manufacturer" value={newAsset.manufacturer} onChange={(e) => setNewAsset({ ...newAsset, manufacturer: e.target.value })} className="border p-3 rounded-xl w-full" />
              <input type="text" placeholder="Model" value={newAsset.model} onChange={(e) => setNewAsset({ ...newAsset, model: e.target.value })} className="border p-3 rounded-xl w-full" />
              <input type="text" placeholder="Cost Center ID" value={newAsset.costCenterId} onChange={(e) => setNewAsset({ ...newAsset, costCenterId: e.target.value })} className="border p-3 rounded-xl w-full" />
              <input type="date" value={newAsset.date} onChange={(e) => setNewAsset({ ...newAsset, date: e.target.value })} className="border p-3 rounded-xl w-full" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setAddAssetPopup(false)} className="bg-gray-400 text-white px-6 py-3 rounded-xl">Cancel</button>
              <button onClick={handleAddAssetSave} className="bg-blue-800 text-white px-6 py-3 rounded-xl">Add Asset</button>
            </div>
          </div>
        </div>
      )}

      {showMessageBox && (
        <MessageBox title={messageBoxContent.title} message={messageBoxContent.message} onClose={hideMessage} />
      )}
    </div>
  );
};

export default AdminDashboard;
