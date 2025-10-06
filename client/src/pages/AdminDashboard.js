import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
    User, Mail, Building, Laptop, Search, Plus, XCircle, Package,
    ClipboardList, History, Clock, FileText, Upload, UserCircle, Edit, ArrowLeftRight, Settings,
    CircleArrowLeft // Import the base component name
} from "lucide-react";

import NokiaLogo from "../logo.png"; 

// FIX: Define the alias here if needed, or just use the imported name.
// Since the error points to the alias not being defined/recognized in JSX,
// we will ensure the usage matches the import. We'll stick to the base name
// in the JSX to prevent further alias confusion.

// The issue might be that you are using 'ReturnedIcon' in the JSX
// but importing it as 'CircleArrowLeft as ReturnedIcon' which sometimes
// causes issues if the bundler isn't perfectly configured for aliases.

// Let's use the actual imported name directly in the JSX for maximum compatibility.

// A custom message box component (Kept for alerts)
const MessageBox = ({ title, message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-xl flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4 text-blue-800 text-center">{title}</h2>
                <p className="mb-4 text-gray-600 text-center">{message}</p>
                <button onClick={onClose} className="bg-gray-400 text-white font-medium px-6 py-3 rounded-xl hover:scale-105 hover:bg-gray-500">
                    Close
                </button>
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
        { serial: "LAP001", manufacturer: "Dell", model: "Latitude 7420", date: "2025-09-01", costCenterId: "CC1001", status: "Assigned", assignedTo: { firstName: "Alice", lastName: "Smith", employeeId: "EMP101", email: "alice.smith@nokia.com", lineManagerId: "MGR001", lineManagerName: "John Manager", lineManagerEmail: "john.manager@nokia.com", costCenterId: "CC1001" }, assignedDate: "2025-09-02" },
        { serial: "LAP002", manufacturer: "HP", model: "EliteBook 840", date: "2025-08-15", costCenterId: "CC1002", status: "Available", assignedTo: null },
        { serial: "LAP003", manufacturer: "Lenovo", model: "ThinkPad X1", date: "2025-08-20", costCenterId: "CC1002", status: "Assigned", assignedTo: { firstName: "Bob", lastName: "Johnson", employeeId: "EMP202", email: "bob.johnson@nokia.com", lineManagerId: "MGR002", lineManagerName: "Jane Manager", lineManagerEmail: "jane.manager@nokia.com", costCenterId: "CC1002" }, assignedDate: "2025-08-21" },
        { serial: "LAP004", manufacturer: "Dell", model: "XPS 15", date: "2025-09-10", costCenterId: "CC1003", status: "Available", assignedTo: null },
        { serial: "LAP005", manufacturer: "Microsoft", model: "Surface Laptop 4", date: "2025-07-25", costCenterId: "CC1003", status: "Assigned", assignedTo: { firstName: "Charlie", lastName: "Brown", employeeId: "EMP303", email: "charlie.brown@nokia.com", lineManagerId: "MGR001", lineManagerName: "John Manager", costCenterId: "CC1003", lineManagerEmail: "john.manager@nokia.com" }, assignedDate: "2025-07-26" },
        { serial: "LAP006", manufacturer: "Apple", model: "MacBook Pro", date: "2025-06-12", costCenterId: "CC1004", status: "Available", assignedTo: null },
    ]);

    // 5. Team Asset Manager Scoping Data (NEW REQUIREMENT)
    const [teamManagers, setTeamManagers] = useState([
        { id: "MGR001", name: "John Manager", email: "john.manager@nokia.com", managedCCs: ["CC1001", "CC1003"] },
        { id: "MGR002", name: "Jane Manager", email: "jane.manager@nokia.com", managedCCs: ["CC1002", "CC1004"] },
    ]);
    const [scopingManagerId, setScopingManagerId] = useState("MGR001");
    const [scopingCCInput, setScopingCCInput] = useState("");
    const [showManagerScoping, setShowManagerScoping] = useState(false);
    const [showManagerCRUD, setShowManagerCRUD] = useState(false); 
    const [newManagerDetails, setNewManagerDetails] = useState({ id: '', name: '', email: '' }); 


    const [requests, setRequests] = useState([
        { serial: "LAP004", manufacturer: "Dell", model: "XPS 15", employeeId: "EMP202", reason: "System heating issues", date: "2025-10-25", type: "Replacement" },
        { serial: "LAP005", manufacturer: "Apple", model: "MacBook Pro", employeeId: "EMP303", reason: "Screen flickering issues", date: "2025-10-24", type: "Return" },
    ]);
    const [transferRequests, setTransferRequests] = useState([
        { serial: "LAP001", employeeId: "EMP101", oldManagerId: "MGR001", oldCCId: "CC1001", newManagerId: "MGR003", newManagerName: "Mark Jones", newManagerEmail: "mark.jones@nokia.com", newCCId: "CC1005", status: "Pending" }
    ]);

    const [storedAssets, setStoredAssets] = useState([]);
    const [history, setHistory] = useState([]);
    const [returnedAssets, setReturnedAssets] = useState([
        { serial: "LAP007", manufacturer: "Acer", model: "Aspire 5", date: "2025-05-10", costCenterId: "CC1001", status: "Returned", assignedTo: null },
    ]);

    // UI States
    const [searchValue, setSearchValue] = useState("");
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [assignPopup, setAssignPopup] = useState(null);
    const [storagePopup, setStoragePopup] = useState(null);
    const [storageReason, setStorageReason] = useState("");
    
    const [rejectPopup, setRejectPopup] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [addAssetPopup, setAddAssetPopup] = useState(false);
    const [newAsset, setNewAsset] = useState({ serial: "", manufacturer: "", model: "", costCenterId: "", date: "" });
    const [showHistory, setShowHistory] = useState(false);
    const [showReturnedAssets, setShowReturnedAssets] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [uploadPopup, setUploadPopup] = useState(false);
    const [uploadCostCenterId, setUploadCostCenterId] = useState("");
    const [uploadFile, setUploadFile] = useState(null);
    const [reportCostCenterId, setReportCostCenterId] = useState("");
    const [editEmployeePopup, setEditEmployeePopup] = useState(null);
    const [editEmployeeDetails, setEditEmployeeDetails] = useState({});
    const [assignDetails, setAssignDetails] = useState({ firstName: "", lastName: "", employeeId: "", email: "", lineManagerId: "", lineManagerEmail: "" });
    const [reissuePopup, setReissuePopup] = useState(null);
    const [reissueDetails, setReissueDetails] = useState({ firstName: "", lastName: "", employeeId: "", email: "", lineManager: "", lineManagerId: "", lineManagerEmail: "", costCenterId: "" });
    
    const [isViewingAll, setIsViewingAll] = useState(false);
    const assetsToShow = 5; 

    // Helpers
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageBoxContent, setMessageBoxContent] = useState({ title: "", message: "" });
    
    const showMessage = (title, message) => {
        setMessageBoxContent({ title, message });
        setShowMessageBox(true);
    };
    const hideMessage = () => setShowMessageBox(false);

    // 6. Calculate Overall Dashboard Metrics (Unchanged)
    const calculateOverallMetrics = () => {
        const total = assets.length;
        const assigned = assets.filter(a => a.status === "Assigned").length;
        const available = total - assigned;

        const ccBreakdown = assets.reduce((acc, asset) => {
            const ccId = asset.costCenterId;
            if (!acc[ccId]) { acc[ccId] = { total: 0, assigned: 0, available: 0 }; }
            acc[ccId].total += 1;
            if (asset.status === "Assigned") { acc[ccId].assigned += 1; }
            else { acc[ccId].available += 1; }
            return acc;
        }, {});

        return { total, assigned, available, ccBreakdown: Object.entries(ccBreakdown).sort(([a], [b]) => a.localeCompare(b)) };
    };

    const metrics = calculateOverallMetrics();

    // === Handlers ===
    
    // NEW: Handle Adding Manager
    const handleAddManager = () => {
        if (!newManagerDetails.id || !newManagerDetails.name || !newManagerDetails.email) {
            showMessage("Error", "Please fill in Manager ID, Name, and Email.");
            return;
        }
        
        const managerExists = teamManagers.some(m => m.id === newManagerDetails.id);
        if (managerExists) {
            showMessage("Error", `Manager ID ${newManagerDetails.id} already exists.`);
            return;
        }

        setTeamManagers(prevManagers => [
            ...prevManagers,
            { ...newManagerDetails, managedCCs: [] } // New managers start with no CCs
        ]);
        
        // Reset state and close modal
        setNewManagerDetails({ id: '', name: '', email: '' });
        setShowManagerCRUD(false);
        showMessage("Success", `New Manager ${newManagerDetails.name} added successfully.`);
    };

    // 5. NEW LOGIC: Add/Remove CC from Manager Scope
    const handleToggleManagerCC = (managerId, ccId, action) => {
        setTeamManagers(prevManagers => prevManagers.map(manager => {
            if (manager.id === managerId) {
                const updatedCCs = action === 'add'
                    ? Array.from(new Set([...manager.managedCCs, ccId]))
                    : manager.managedCCs.filter(cc => cc !== ccId);
                
                return { ...manager, managedCCs: updatedCCs };
            }
            return manager;
        }));
        showMessage("Success", `Cost Centre ${ccId} ${action === 'add' ? 'added to' : 'removed from'} manager ${managerId}.`);
        setScopingCCInput("");
    };

    // 3. NEW LOGIC: Move to Store/Inventory (Replaces Delete Confirm)
    const handleMoveToStoreConfirm = (asset) => {
        const words = storageReason.trim().split(/\s+/).filter(Boolean).length;
        if (words > 25 || words === 0) {
            showMessage("Invalid Reason", "Please provide a reason (max 25 words).");
            return;
        }
        
        // 1. Add to stored assets list
        setStoredAssets(prevStored => [...prevStored, { 
            ...asset, 
            status: "In Storage", 
            storageReason: storageReason, 
            storageDate: new Date().toISOString().split("T")[0] 
        }]);
        
        // 2. Remove from main asset list
        setAssets(prevAssets => prevAssets.filter((a) => a.serial !== asset.serial));
        
        setStoragePopup(null);
        setStorageReason("");
        showMessage("Asset Moved", `Asset ${asset.serial} moved to Inventory for storage.`);
    };

    // 3. NEW LOGIC: Generate Report logic (Unchanged)
    const handleGenerateReport = () => {
        if (!reportCostCenterId) {
            showMessage("Error", "Please enter a Cost Centre ID for the report.");
            return;
        }
        const reportData = assets.filter(a => a.costCenterId === reportCostCenterId);
        if (reportData.length === 0) {
            showMessage("Error", `No assets found for CC ${reportCostCenterId}.`);
            return;
        }
        
        const data = reportData.map(asset => ({
            'Serial No': asset.serial, 'Manufacturer': asset.manufacturer, 'Model': asset.model,
            'Status': asset.status, 'Assigned To Emp ID': asset.assignedTo?.employeeId || 'N/A',
            'CC ID': asset.costCenterId,
        }));
        showMessage("Report Generated", `Report for CC ${reportCostCenterId} generated successfully! (Simulated Download)`);
    };

    // Remaining Handlers (Unchanged logic)
    const handleApprove = (req) => {
        if (req.type === 'Return') {
            const assetToReturn = assets.find(a => a.serial === req.serial);
            if (assetToReturn) {
                setReturnedAssets(prevReturned => [...prevReturned, { ...assetToReturn, status: 'Returned', assignedTo: null }]);
                setAssets(prevAssets => prevAssets.filter(a => a.serial !== req.serial));
            }
        } 
        setRequests(prevReqs => prevReqs.filter((r) => r.serial !== req.serial));
        showMessage("Request Approved", `Request for ${req.serial} has been approved.`);
    };

    const handleReject = (req) => {
        const words = rejectReason.trim().split(/\s+/).filter(Boolean).length;
        if (words > 25 || words === 0) {
            showMessage("Invalid Reason", "Please provide a reason (max 25 words).");
            return;
        }
        setRequests(prevReqs => prevReqs.filter((r) => r.serial !== req.serial));
        setRejectPopup(null);
        setRejectReason("");
        showMessage("Request Rejected", `Request for ${req.serial} has been rejected.`);
    };
    
    const handleAssignSave = () => {
        if (!assignDetails.firstName || !assignDetails.lastName || !assignDetails.employeeId || !assignDetails.email) {
            showMessage("Missing Information", "Please fill all required fields.");
            return;
        }
        setAssets(
            prevAssets => prevAssets.map((asset) =>
                asset.serial === assignPopup.serial
                    ? { 
                        ...asset, 
                        status: "Assigned", 
                        assignedTo: { 
                            ...assignDetails, 
                            name: `${assignDetails.firstName} ${assignDetails.lastName}`, 
                            costCenterId: assignPopup.costCenterId 
                        },
                        assignedDate: new Date().toISOString().split('T')[0] 
                    }
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
                    firstName: reissueDetails.firstName, lastName: reissueDetails.lastName, name: `${reissueDetails.firstName} ${reissueDetails.lastName}`,
                    employeeId: reissueDetails.employeeId, email: reissueDetails.email, lineManager: reissueDetails.lineManager,
                    lineManagerId: reissueDetails.lineManagerId, lineManagerEmail: reissueDetails.lineManagerEmail, costCenterId: reissueDetails.costCenterId
                },
                assignedDate: new Date().toISOString().split('T')[0] 
            };
            setAssets(prevAssets => [...prevAssets, updatedAsset]);
            setReturnedAssets(prevReturned => prevReturned.filter(a => a.serial !== reissuePopup.serial));
            setReissuePopup(null);
            showMessage("Reissue Successful", `Asset ${reissuedAsset.serial} has been successfully reissued.`);
        }
    };
    
    const handleAddAssetSave = () => {
        if (!newAsset.serial || !newAsset.manufacturer || !newAsset.model || !newAsset.costCenterId) {
            showMessage("Missing Information", "Please fill all fields.");
            return;
        }
        setAssets(prevAssets => [...prevAssets, { ...newAsset, status: "Available", assignedTo: null }]);
        setNewAsset({ serial: "", manufacturer: "", model: "", costCenterId: "", date: "" });
        setAddAssetPopup(false);
        showMessage("Asset Added", "New asset has been added successfully.");
    };

    const handleSearch = () => {
        const query = searchValue.toLowerCase();
        const results = assets.filter(
            (asset) =>
                asset.serial.toLowerCase().includes(query) ||
                asset.costCenterId.toLowerCase().includes(query) ||
                asset.assignedTo?.employeeId?.toLowerCase().includes(query)
        );
        setFilteredAssets(results);
        setIsViewingAll(true);
    };

    const handleEditEmployeeSave = () => {
        if (!editEmployeeDetails.employeeId || !editEmployeeDetails.email) {
            showMessage("Error", "Employee ID and Email are required.");
            return;
        }
        setAssets(prevAssets => prevAssets.map(asset => {
            if (asset.assignedTo?.employeeId === editEmployeeDetails.employeeId) {
                return {
                    ...asset,
                    assignedTo: {
                        ...asset.assignedTo,
                        ...editEmployeeDetails,
                        name: `${editEmployeeDetails.firstName} ${editEmployeeDetails.lastName}`.trim(),
                    }
                };
            }
            return asset;
        }));
        setEditEmployeePopup(null);
        setSelectedEmployee(null);
        showMessage("Success", `Employee details for ${editEmployeeDetails.employeeId} updated.`);
    };

    const handleUploadSave = () => {
        if (!uploadFile || !uploadCostCenterId) {
            showMessage("Error", "Please select a file and enter a Cost Centre ID.");
            return;
        }
        showMessage("Upload Simulation", `Pretending to process file for CC ${uploadCostCenterId}.`);
        setUploadPopup(false);
    };

    const handleDeleteUploadedAssets = () => {
        if (!uploadCostCenterId) {
            showMessage("Error", "Enter the CC ID to delete uploaded assets.");
            return;
        }
        const initialCount = assets.length;
        const remainingAssets = assets.filter(asset => asset.costCenterId !== uploadCostCenterId);
        
        if (remainingAssets.length === initialCount) {
            showMessage("Error", `No assets found for CC ${uploadCostCenterId}.`);
            return;
        }

        setAssets(remainingAssets);
        showMessage("Deletion Success", `${initialCount - remainingAssets.length} assets from CC ${uploadCostCenterId} deleted.`);
        setUploadPopup(false);
    };

    const handleApproveTransfer = (req) => {
        setAssets(prevAssets => prevAssets.map(asset => {
            if (asset.serial === req.serial) {
                return {
                    ...asset,
                    status: "Assigned", 
                    assignedTo: {
                        ...asset.assignedTo, lineManagerId: req.newManagerId, lineManagerName: req.newManagerName,
                        lineManagerEmail: req.newManagerEmail, costCenterId: req.newCCId 
                    }
                };
            }
            return asset;
        }));
        setTransferRequests(prevReqs => prevReqs.filter(r => r.serial !== req.serial));
        showMessage("Transfer Approved", `Employee transfer for asset ${req.serial} to ${req.newManagerName} has been approved.`);
    };

    const handleApproveReplacement = (req) => {
        setAssets(prevAssets => prevAssets.filter(a => a.serial !== req.serial));
        setReturnedAssets(prevReturned => [...prevReturned, {
            serial: req.serial, manufacturer: req.manufacturer, model: req.model,
            date: req.date, costCenterId: req.costCenterId, status: "Pending Inspection", assignedTo: null
        }]);
        setRequests(prevReqs => prevReqs.filter(r => r.serial !== req.serial));
        showMessage("Replacement Approved", `Asset ${req.serial} marked for return/inspection. Please proceed to the 'Returned Assets' section to assign a NEW asset to employee ${req.employeeId}.`);
    };

    // Table display logic
    const allAssetsList = filteredAssets.length > 0 ? filteredAssets : assets;
    const assetsToRender = isViewingAll ? allAssetsList : allAssetsList.slice(0, assetsToShow);
    const showViewMore = !isViewingAll && assets.length > assetsToShow;


    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
            {showMessageBox && (<MessageBox title={messageBoxContent.title} message={messageBoxContent.message} onClose={hideMessage} />)}
            

            <header className="bg-blue-900 text-white p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-4">
                    <img src={NokiaLogo} alt="Nokia Logo" className="w-20 h-auto" />
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setShowProfile(true)} className="text-white hover:text-gray-300 transition-colors">
                        <UserCircle size={28} />
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="container mx-auto p-6 space-y-8">
                
                {/* 6. Overall Asset Count Metrics (Unchanged) */}
                <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2">Overall Asset Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-5 rounded-2xl shadow-xl border-l-4 border-blue-600">
                        <p className="text-sm font-medium text-gray-500">Total Assets (Assigned + Available)</p>
                        <p className="text-3xl font-bold text-blue-900 mt-1">{metrics.total}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-xl border-l-4 border-red-600">
                        <p className="text-sm font-medium text-gray-500">Total Assigned</p>
                        <p className="text-3xl font-bold text-red-700 mt-1">{metrics.assigned}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-xl border-l-4 border-green-600">
                        <p className="text-sm font-medium text-gray-500">Total Available</p>
                        <p className="text-3xl font-bold text-green-700 mt-1">{metrics.available}</p>
                    </div
                    >
                </div>

                {/* 6. Cost Centre Breakdown (Unchanged) */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-blue-900 flex items-center gap-2">
                        <ClipboardList size={24} /> Asset Breakdown by Cost Centre
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {metrics.ccBreakdown.map(([ccId, data]) => (
                            <div key={ccId} className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                <p className="text-lg font-bold text-blue-800 mb-1 flex items-center gap-2">
                                    <Building size={18} /> CC: {ccId}
                                </p>
                                <p className="text-sm">Total: <span className="font-bold">{data.total}</span></p>
                                <p className="text-sm text-red-600">Assigned: <span className="font-bold">{data.assigned}</span></p>
                                <p className="text-sm text-green-600">Available: <span className="font-bold">{data.available}</span></p>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* 5. NEW SECTION: User Access Management (Manager Scoping) */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <button 
                        onClick={() => setShowManagerScoping(!showManagerScoping)}
                        className="w-full text-left text-xl font-semibold text-blue-900 flex items-center justify-between gap-2"
                    >
                        <span><Settings size={24} className="inline mr-2" /> User Access Management (Manager Scoping)</span>
                        <span className="text-sm text-gray-500">Click to {showManagerScoping ? 'hide' : 'configure'}</span>
                    </button>
                    {showManagerScoping && (
                        <div className="mt-4 border-t pt-4">
                            <button 
                                onClick={() => setShowManagerCRUD(true)}
                                className="bg-purple-800 text-white px-4 py-2 rounded-lg mb-4 hover:bg-purple-700"
                            >
                                <Plus size={16} className="inline mr-1" /> Add/Manage Managers
                            </button>
                            <h3 className="text-lg font-semibold mb-3">Define Manager Permissions:</h3>
                            
                            {/* Manager Selector */}
                            <select 
                                value={scopingManagerId} 
                                onChange={(e) => setScopingManagerId(e.target.value)}
                                className="border p-2 rounded-lg w-full md:w-1/3 mb-4"
                            >
                                {teamManagers.map(mgr => (
                                    <option key={mgr.id} value={mgr.id}>{mgr.name} ({mgr.id})</option>
                                ))}
                            </select>

                            {/* CC Assignment Tool */}
                            <div className="flex flex-col md:flex-row gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Enter CC ID to add/remove (e.g., CC1001)"
                                    value={scopingCCInput}
                                    onChange={(e) => setScopingCCInput(e.target.value.toUpperCase())}
                                    className="border p-2 rounded-lg w-full md:w-2/3"
                                />
                                <button
                                    onClick={() => handleToggleManagerCC(scopingManagerId, scopingCCInput, 'add')}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 w-full md:w-auto"
                                    disabled={!scopingCCInput}
                                >
                                    <Plus size={16} className="inline mr-1" /> Add CC
                                </button>
                            </div>

                            {/* Current Scopes Display */}
                            <div className="p-3 bg-gray-50 rounded-lg border">
                                <h4 className="font-semibold text-sm mb-2">
                                    {teamManagers.find(m => m.id === scopingManagerId)?.name}'s Managed Cost Centres:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {teamManagers.find(m => m.id === scopingManagerId)?.managedCCs.map(cc => (
                                        <span 
                                            key={cc} 
                                            className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-blue-200"
                                            onClick={() => handleToggleManagerCC(scopingManagerId, cc, 'remove')}
                                        >
                                            {cc} <XCircle size={12} className="inline ml-1" />
                                        </span>
                                    ))}
                                    {teamManagers.find(m => m.id === scopingManagerId)?.managedCCs.length === 0 && (
                                        <p className="text-gray-500 text-sm">No CCs assigned yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>


                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    
                    <h2 className="text-xl font-semibold mb-6 text-blue-900 flex items-center gap-2">
                        <Laptop size={24} /> Asset Management
                    </h2>
                    
                    {/* 3. UPDATED: Unified Action Bar for Admin */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center flex-wrap">
                        <div className="relative w-full sm:w-72">
                            <input
                                type="text"
                                placeholder="Search by S/N, Emp ID, or CC ID"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="border border-gray-300 rounded-lg pl-10 pr-2 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                            />
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <button onClick={handleSearch} className="bg-blue-900 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-800 transition-colors w-full sm:w-auto">Search</button>
                        <button onClick={() => setAddAssetPopup(true)} className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                            <Plus size={20} /> Add New Asset
                        </button>
                        
                        <button onClick={() => setUploadPopup(true)} className="bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                            <Upload size={20} /> Upload/Delete
                        </button>
                        
                        <input
                            type="text"
                            placeholder="CC ID for Report"
                            value={reportCostCenterId}
                            onChange={(e) => setReportCostCenterId(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                        />
                        <button onClick={handleGenerateReport} className="bg-cyan-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-cyan-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                            <FileText size={20} /> Generate Report
                        </button>
                    </div>

                    {/* Asset Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
                        <table className="min-w-full border-collapse table-fixed text-left">
                            <thead className="bg-blue-100 text-blue-900">
                                <tr>
                                    <th className="p-3 w-32">Serial No</th>
                                    <th className="p-3 w-36">Manufacturer</th>
                                    <th className="p-3 w-48">Model</th>
                                    <th className="p-3 w-32">Date</th>
                                    <th className="p-3 w-32">Status</th>
                                    <th className="p-3 w-36">Assigned To</th>
                                    <th className="p-3 w-40">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assetsToRender.map((asset) => (
                                    <tr key={asset.serial} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="p-3 break-words">{asset.serial}</td>
                                        <td className="p-3 break-words">{asset.manufacturer}</td>
                                        <td className="p-3 break-words">{asset.model}</td>
                                        <td className="p-3 break-words">{asset.date}</td>
                                        <td className="p-3">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${asset.status === "Assigned" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td className="p-3 break-words">
                                            {asset.assignedTo ? (
                                                <div className="flex items-center space-x-2">
                                                    <button onClick={() => setSelectedEmployee(asset.assignedTo)} className="text-blue-700 underline hover:no-underline">{asset.assignedTo.employeeId}</button>
                                                    {/* 4. EDIT OPTION: Admin can directly edit employee details */}
                                                    <button onClick={() => setEditEmployeePopup(asset.assignedTo)} className="p-1 rounded hover:bg-gray-200">
                                                        <Edit size={16} className="text-gray-500 hover:text-blue-600" />
                                                    </button>
                                                </div>
                                            ) : ("—")}
                                        </td>
                                        <td className="p-3 flex space-x-2">
                                            {asset.status === "Available" ? (
                                                <button onClick={() => setAssignPopup(asset)} className="bg-green-600 text-white px-3 py-1 rounded-lg">Assign</button>
                                            ) : (
                                                // 3. REPLACED: Delete button replaced with Move to Store/Inventory
                                                <button onClick={() => setStoragePopup(asset)} className="bg-red-600 text-white px-3 py-1 rounded-lg">Move to Inventory</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {assetsToRender.length === 0 && (
                                    <tr><td colSpan="7" className="p-4 text-center text-gray-500">No assets found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Show More / Show Less Buttons */}
                    <div className="flex justify-center items-center mt-6">
                        {showViewMore && (
                            <button onClick={() => setIsViewingAll(true)} className="bg-blue-900 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-blue-800 transition-colors">
                                View All Assets ({assets.length})
                            </button>
                        )}
                        {isViewingAll && !searchValue && (
                            <button onClick={() => { setIsViewingAll(false); setFilteredAssets([]); }} className="bg-blue-900 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-blue-800 transition-colors">
                                Show Less
                            </button>
                        )}
                    </div>
                </div>

                {/* 5. Team Transfer Approval Queue (Unchanged) */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-orange-600 flex items-center gap-2">
                        <Clock size={24} /> Team Transfer Approvals ({transferRequests.length})
                    </h2>
                    {transferRequests.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
                            <table className="min-w-full border-collapse text-left">
                                <thead className="bg-orange-100 text-orange-900">
                                    <tr>
                                        <th className="p-3">Asset</th><th className="p-3">Employee</th><th className="p-3">Old Manager</th>
                                        <th className="p-3">New Manager (Email)</th><th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transferRequests.map((req) => (
                                        <tr key={req.serial} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                            <td className="p-3">{req.serial}</td><td className="p-3">{req.employeeId}</td>
                                            <td className="p-3">{req.oldManagerId} ({req.oldCCId})</td>
                                            <td className="p-3">{req.newManagerName} ({req.newCCId})</td>
                                            <td className="p-3">
                                                <button onClick={() => handleApproveTransfer(req)} className="bg-green-600 text-white px-3 py-1 rounded-lg mr-2">Approve</button>
                                                <button onClick={() => setRejectPopup(req)} className="bg-red-600 text-white px-3 py-1 rounded-lg">Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-gray-500">No pending team transfer requests.</p>}
                </div>
                
                {/* RENAMED: General Requests -> Asset Request Queue (Unchanged) */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-blue-900 flex items-center gap-2">
                        <Clock size={24} /> Asset Request Queue ({requests.length})
                    </h2>
                    {requests.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
                            <table className="min-w-full border-collapse text-left">
                                <thead className="bg-blue-100 text-blue-900">
                                    <tr>
                                        <th className="p-3">Serial</th> <th className="p-3">Employee ID</th> <th className="p-3">Type</th> <th className="p-3">Reason</th> <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((req) => (
                                        <tr key={req.serial} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                            <td className="p-3">{req.serial}</td><td className="p-3">{req.employeeId}</td>
                                            <td className="p-3"><span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${req.type === 'Return' ? 'bg-orange-200 text-orange-800' : 'bg-red-200 text-red-800'}`}>{req.type}</span></td>
                                            <td className="p-3">{req.reason}</td>
                                            <td className="p-3 flex space-x-2">
                                                {req.type === 'Replacement' ? (
                                                    <button onClick={() => handleApproveReplacement(req)} className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1">
                                                        <ArrowLeftRight size={16} /> Approve & Return
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleApprove(req)} className="bg-green-600 text-white px-3 py-1 rounded-lg">Approve</button>
                                                )}
                                                <button onClick={() => setRejectPopup(req)} className="bg-red-600 text-white px-3 py-1 rounded-lg">Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-gray-500">No general pending requests.</p>}
                </div>
                
                {/* 4. Returned Assets Section (Now clearly displayed) */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <button 
                        onClick={() => setShowReturnedAssets(!showReturnedAssets)}
                        className="w-full text-left text-xl font-semibold text-blue-900 flex items-center justify-between gap-2"
                    >
                        {/* FIX APPLIED: Using the imported name, not the alias */}
                        <span><CircleArrowLeft size={24} className="inline mr-2" /> Returned Assets ({returnedAssets.length})</span>
                        <span className="text-sm text-gray-500">Click to {showReturnedAssets ? 'hide' : 'view'}</span>
                    </button>
                    {showReturnedAssets && (
                        returnedAssets.length > 0 ? (
                            <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm mt-4">
                                <table className="min-w-full border-collapse text-left">
                                    <thead className="bg-blue-100 text-blue-900">
                                        <tr>
                                            <th className="p-3">Serial</th><th className="p-3">Manufacturer</th><th className="p-3">Model</th>
                                            <th className="p-3">Status</th><th className="p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {returnedAssets.map((asset) => (
                                            <tr key={asset.serial} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                <td className="p-3">{asset.serial}</td>
                                                <td className="p-3">{asset.manufacturer}</td>
                                                <td className="p-3">{asset.model}</td>
                                                <td className="p-3"><span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">{asset.status}</span></td>
                                                <td className="p-3 flex space-x-2">
                                                    <button onClick={() => setReissuePopup(asset)} className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1">
                                                        <Package size={16} /> Reissue
                                                    </button>
                                                    <button onClick={() => setStoragePopup(asset)} className="bg-red-600 text-white px-3 py-1 rounded-lg">Move to Inventory</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : <p className="text-gray-500 mt-4">No assets pending reissue.</p>
                    )}
                </div>
                
                {/* Archived / Stored Inventory Section */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <button 
                        onClick={() => setShowHistory(!showHistory)}
                        className="w-full text-left text-xl font-semibold text-blue-900 flex items-center justify-between gap-2"
                    >
                        <span><History size={24} className="inline mr-2" /> Archived / Stored Inventory ({storedAssets.length})</span>
                        <span className="text-sm text-gray-500">Click to {showHistory ? 'hide' : 'view'}</span>
                    </button>
                    {showHistory && (
                        storedAssets.length > 0 ? (
                            <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm mt-4">
                                <table className="w-full border-collapse text-left">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3">Serial</th><th className="p-3">CC ID</th><th className="p-3">Status</th><th className="p-3">Date Stored</th><th className="p-3">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {storedAssets.map((h) => <tr key={h.serial} className="border-b border-gray-200">
                                            <td className="p-3">{h.serial}</td>
                                            <td className="p-3">{h.costCenterId}</td>
                                            <td className="p-3">{h.status}</td>
                                            <td className="p-3">{h.storageDate}</td>
                                            <td className="p-3">{h.storageReason}</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        ) : <p className="text-gray-500 mt-4">No assets currently in long-term storage.</p>
                    )}
                </div>
            </div>


            {/* =======================================================
               POPUPS
            ======================================================= */}

            {/* NEW POPUP: Manage Team Managers (CRUD) */}
            {showManagerCRUD && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-2xl shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-blue-900">Manage Team Asset Managers</h2>
                            <button onClick={() => setShowManagerCRUD(false)} className="text-gray-500 hover:text-gray-700"><XCircle size={24} /></button>
                        </div>
                        
                        {/* 1. Add New Manager Form */}
                        <h3 className="text-lg font-semibold mb-2 mt-4 text-green-700">Add New Manager</h3>
                        <div className="grid grid-cols-3 gap-3 border p-3 rounded-lg bg-green-50">
                            <input type="text" placeholder="Manager ID (e.g., MGR003)" value={newManagerDetails.id} onChange={(e) => setNewManagerDetails({ ...newManagerDetails, id: e.target.value.toUpperCase() })} className="border p-2 rounded-xl" />
                            <input type="text" placeholder="Name" value={newManagerDetails.name} onChange={(e) => setNewManagerDetails({ ...newManagerDetails, name: e.target.value })} className="border p-2 rounded-xl" />
                            <input type="email" placeholder="Email" value={newManagerDetails.email} onChange={(e) => setNewManagerDetails({ ...newManagerDetails, email: e.target.value })} className="border p-2 rounded-xl" />
                            <button onClick={handleAddManager} className="bg-green-600 text-white px-4 py-2 rounded-lg col-span-3 hover:bg-green-700">
                                <Plus size={16} className="inline mr-1" /> Add Manager
                            </button>
                        </div>

                        {/* 2. Existing Managers List */}
                        <h3 className="text-lg font-semibold mb-2 mt-6">Existing Managers ({teamManagers.length})</h3>
                        <div className="overflow-y-auto max-h-60 border rounded-lg">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr><th className="p-2">ID</th><th className="p-2">Name</th><th className="p-2">CC Count</th><th className="p-2">Action</th></tr>
                                </thead>
                                <tbody>
                                    {teamManagers.map((manager) => (
                                        <tr key={manager.id} className="border-t hover:bg-gray-50">
                                            <td className="p-2 font-medium">{manager.id}</td>
                                            <td className="p-2">{manager.name}</td>
                                            <td className="p-2">{manager.managedCCs.length}</td>
                                            <td className="p-2">
                                                <button 
                                                    onClick={() => setTeamManagers(teamManagers.filter(m => m.id !== manager.id))}
                                                    className="text-red-500 hover:text-red-700 text-xs"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowManagerCRUD(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Done</button>
                        </div>
                    </div>
                </div>
            )}


            {/* NEW POPUP: Move to Inventory (Replaces Delete Popup) */}
            {storagePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-red-700">Move Asset to Inventory</h2>
                            <button onClick={() => setStoragePopup(null)} className="text-gray-500 hover:text-gray-700"><XCircle size={24} /></button>
                        </div>
                        <p className="mb-3 text-sm text-gray-600">You are moving **{storagePopup.serial}** out of circulation.</p>
                        <textarea 
                            rows="3" 
                            value={storageReason} 
                            onChange={(e) => setStorageReason(e.target.value)} 
                            className="border p-3 w-full rounded-xl" 
                            placeholder="Reason for moving to inventory (e.g., end-of-life, lost, faulty, disposal pending)..."
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setStoragePopup(null)} className="bg-gray-400 text-white px-6 py-3 rounded-xl">Cancel</button>
                            <button onClick={() => handleMoveToStoreConfirm(storagePopup)} className="bg-red-600 text-white px-6 py-3 rounded-xl">Confirm Move</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* 2. PROFILE POPUP (Unchanged) */}
            {showProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-40 animate-fadeIn">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm transform scale-100 transition-transform duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-blue-900">Admin Profile</h2>
                            <button onClick={() => setShowProfile(false)} className="text-gray-500 hover:text-gray-700"><XCircle size={24} /></button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2"><User size={18} className="text-blue-500" /> <p><strong>Name:</strong> {adminDetails.name}</p></div>
                            <div className="flex items-center gap-2"><ClipboardList size={18} className="text-blue-500" /> <p><strong>ID:</strong> {adminDetails.adminId}</p></div>
                            <div className="flex items-center gap-2"><Mail size={18} className="text-blue-500" /> <p><strong>Email:</strong> {adminDetails.email}</p></div>
                            <div className="flex items-center gap-2"><Building size={18} className="text-blue-500" /> <p><strong>Role:</strong> {adminDetails.role}</p></div>
                        </div>
                        <button onClick={() => setShowProfile(false)} className="mt-6 w-full bg-blue-900 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-800 transition-colors">Close</button>
                    </div>
                </div>
            )}
            
            {/* 3. UPLOAD/DELETE POPUP (Unchanged) */}
            {uploadPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-40 animate-fadeIn">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md transform scale-100 transition-transform duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-blue-900">Bulk Upload & Deletion</h2>
                            <button onClick={() => setUploadPopup(false)} className="text-gray-500 hover:text-gray-700"><XCircle size={24} /></button>
                        </div>
                        <div className="space-y-3">
                            <input type="text" placeholder="Cost Centre ID (For Upload/Delete)" value={uploadCostCenterId} onChange={(e) => setUploadCostCenterId(e.target.value)} className="border p-3 rounded-xl w-full" />
                            <p className="text-sm text-gray-500">Upload new assets:</p>
                            <input type="file" accept=".xlsx, .xls, .csv" onChange={(e) => setUploadFile(e.target.files[0])} className="w-full text-sm text-gray-500" />
                        </div>
                        <div className="flex flex-col gap-2 mt-6">
                            <button onClick={handleUploadSave} className="bg-blue-900 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-800 transition-colors">
                                <Upload size={20} className="inline mr-2" /> Upload Assets
                            </button>
                            <button onClick={handleDeleteUploadedAssets} className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 transition-colors">
                                <XCircle size={20} className="inline mr-2" /> Delete Assets by CC ID
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* 4. EMPLOYEE EDIT POPUP (Unchanged) */}
            {editEmployeePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-40 animate-fadeIn">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg transform scale-100 transition-transform duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-blue-900">Edit Employee Details: {editEmployeePopup.employeeId}</h2>
                            <button onClick={() => setEditEmployeePopup(null)} className="text-gray-500 hover:text-gray-700"><XCircle size={24} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Employee Details */}
                            <input type="text" placeholder="First Name" value={editEmployeeDetails.firstName || editEmployeePopup.firstName} onChange={(e) => setEditEmployeeDetails({ ...editEmployeeDetails, firstName: e.target.value })} className="border p-3 rounded-xl" />
                            <input type="text" placeholder="Last Name" value={editEmployeeDetails.lastName || editEmployeePopup.lastName} onChange={(e) => setEditEmployeeDetails({ ...editEmployeeDetails, lastName: e.target.value })} className="border p-3 rounded-xl" />
                            <input type="email" placeholder="Email" value={editEmployeeDetails.email || editEmployeePopup.email} onChange={(e) => setEditEmployeeDetails({ ...editEmployeeDetails, email: e.target.value })} className="border p-3 rounded-xl col-span-2" />
                            <input type="text" placeholder="Cost Center ID" value={editEmployeeDetails.costCenterId || editEmployeePopup.costCenterId} onChange={(e) => setEditEmployeeDetails({ ...editEmployeeDetails, costCenterId: e.target.value })} className="border p-3 rounded-xl" />
                            
                            {/* Manager Details */}
                            <input type="text" placeholder="Line Manager Name" value={editEmployeeDetails.lineManagerName || editEmployeePopup.lineManagerName} onChange={(e) => setEditEmployeeDetails({ ...editEmployeeDetails, lineManagerName: e.target.value })} className="border p-3 rounded-xl col-span-2" />
                            <input type="text" placeholder="Manager ID" value={editEmployeeDetails.lineManagerId || editEmployeePopup.lineManagerId} onChange={(e) => setEditEmployeeDetails({ ...editEmployeeDetails, lineManagerId: e.target.value })} className="border p-3 rounded-xl" />
                            <input type="email" placeholder="Manager Email" value={editEmployeeDetails.lineManagerEmail || editEmployeePopup.lineManagerEmail} onChange={(e) => setEditEmployeeDetails({ ...editEmployeeDetails, lineManagerEmail: e.target.value })} className="border p-3 rounded-xl" />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setEditEmployeePopup(null)} className="bg-gray-400 text-white px-6 py-3 rounded-xl">Cancel</button>
                            <button onClick={handleEditEmployeeSave} className="bg-blue-800 text-white px-6 py-3 rounded-xl">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Employee Details Popup (Unchanged) */}
            {selectedEmployee && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-40 animate-fadeIn">
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm transform scale-100 transition-transform duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-blue-900">Employee Details</h2>
                    <button onClick={() => setSelectedEmployee(null)} className="text-gray-500 hover:text-gray-700"><XCircle size={24} /></button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2"><User size={18} className="text-blue-500" /> <p><strong>Name:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}</p></div>
                    <div className="flex items-center gap-2"><ClipboardList size={18} className="text-blue-500" /> <p><strong>ID:</strong> {selectedEmployee.employeeId}</p></div>
                    <div className="flex items-center gap-2"><Mail size={18} className="text-blue-500" /> <p><strong>Email:</strong> {selectedEmployee.email}</p></div>
                    <div className="flex items-center gap-2"><User size={18} className="text-blue-500" /> <p><strong>Line Manager ID:</strong> {selectedEmployee.lineManagerId}</p></div>
                    <div className="flex items-center gap-2"><Mail size={18} className="text-blue-500" /> <p><strong>Line Manager Email:</strong> {selectedEmployee.lineManagerEmail}</p></div>
                    <div className="flex items-center gap-2"><Building size={18} className="text-blue-500" /> <p><strong>Cost Center ID:</strong> {selectedEmployee.costCenterId}</p></div>
                  </div>
                  <button onClick={() => setSelectedEmployee(null)} className="mt-6 w-full bg-blue-900 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-800 transition-colors">Close</button>
                </div>
              </div>
            )}

            {/* Assign Popup (Unchanged) */}
            {assignPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 animate-fadeIn">
                <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-blue-800">Assign Asset: {assignPopup.serial}</h2>
                    <button onClick={() => setAssignPopup(null)} className="text-gray-500 hover:text-gray-700"><XCircle size={24} /></button>
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

            {/* Reject Popup (Unchanged) */}
            {rejectPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 animate-fadeIn">
                <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-red-700">Reject Request</h2>
                    <button onClick={() => setRejectPopup(null)} className="text-gray-500 hover:text-gray-700"><XCircle size={24} /></button>
                  </div>
                  <textarea rows="3" value={rejectReason} onChange={(e) => { setRejectReason(e.target.value); }} className="border p-3 w-full rounded-xl" placeholder="Reason for rejection..."/>
                  <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setRejectPopup(null)} className="bg-gray-400 text-white px-6 py-3 rounded-xl">Cancel</button>
                    <button onClick={() => handleReject(rejectPopup)} className="bg-red-600 text-white px-6 py-3 rounded-xl">Reject</button>
                  </div>
                </div>
              </div>
            )}

            {/* Reissue Popup (Unchanged) */}
            {reissuePopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 animate-fadeIn">
                <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-blue-800">Reissue Asset: {reissuePopup.serial}</h2>
                    <button onClick={() => setReissuePopup(null)} className="text-gray-500 hover:text-gray-700"><XCircle size={24} /></button>
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

            {/* Add Asset Popup (Unchanged) */}
            {addAssetPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 animate-fadeIn">
                <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-blue-800">Add New Asset</h2>
                    <button onClick={() => setAddAssetPopup(false)} className="text-gray-500 hover:text-gray-700"><XCircle size={24} /></button>
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
        </div>
    );
};

export default AdminDashboard;