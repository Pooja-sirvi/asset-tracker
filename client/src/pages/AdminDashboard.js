import React, { useState } from "react";

function AdminDashboard() {
  // Dummy data for Assets
  const [assets, setAssets] = useState([
    {
      id: "LAP001",
      type: "Laptop",
      name: "Dell Latitude 7420",
      date: "2025-09-01",
      status: "Assigned",
      assignedTo: "EMP101",
    },
    {
      id: "MON002",
      type: "Monitor",
      name: "Dell 24-inch",
      date: "2025-08-15",
      status: "Available",
      assignedTo: null,
    },
    {
      id: "PHN003",
      type: "Phone",
      name: "iPhone 13",
      date: "2025-07-20",
      status: "Assigned",
      assignedTo: "EMP102",
    },
  ]);

  // Dummy data for History
  const [history, setHistory] = useState([
    {
      id: "LAP010",
      type: "Laptop",
      name: "HP EliteBook 840",
      date: "2025-06-10",
      status: "Deleted",
      assignedTo: "EMP099",
    },
  ]);

  const [newAsset, setNewAsset] = useState({});

  // Add new asset
  const handleAddAsset = () => {
    if (!newAsset.id || !newAsset.type || !newAsset.name) {
      alert("Please fill Asset ID, Type, and Name.");
      return;
    }

    setAssets([
      ...assets,
      {
        id: newAsset.id,
        type: newAsset.type,
        name: newAsset.name,
        date: newAsset.date || new Date().toISOString().split("T")[0],
        status: newAsset.assignedTo ? "Assigned" : "Available",
        assignedTo: newAsset.assignedTo || null,
      },
    ]);

    setNewAsset({});
  };

  // Reissue asset to new employee
  const handleReissue = (id) => {
    const employeeId = prompt("Enter Employee ID to assign this asset:");
    if (!employeeId) return;

    setAssets(
      assets.map((asset) =>
        asset.id === id
          ? { ...asset, assignedTo: employeeId, status: "Assigned" }
          : asset
      )
    );
  };

  // Delete asset (move to history)
  const handleDelete = (id) => {
    const assetToDelete = assets.find((a) => a.id === id);
    if (assetToDelete) {
      setHistory([...history, { ...assetToDelete, status: "Deleted" }]);
      setAssets(assets.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Admin Dashboard
      </h1>

      {/* Add New Asset */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Asset</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Asset ID (e.g., LAP123)"
            value={newAsset.id || ""}
            onChange={(e) => setNewAsset({ ...newAsset, id: e.target.value })}
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Asset Type (e.g., Laptop, Phone)"
            value={newAsset.type || ""}
            onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Asset Name/Model"
            value={newAsset.name || ""}
            onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
            className="border rounded-lg p-2"
          />
          <input
            type="date"
            value={newAsset.date || new Date().toISOString().split("T")[0]}
            onChange={(e) => setNewAsset({ ...newAsset, date: e.target.value })}
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Assign to Employee ID (optional)"
            value={newAsset.assignedTo || ""}
            onChange={(e) =>
              setNewAsset({ ...newAsset, assignedTo: e.target.value })
            }
            className="border rounded-lg p-2"
          />
        </div>
        <button
          onClick={handleAddAsset}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Asset
        </button>
      </div>

      {/* Assets Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Assets</h2>
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Asset ID</th>
              <th className="p-3">Type</th>
              <th className="p-3">Name</th>
              <th className="p-3">Date Added</th>
              <th className="p-3">Status</th>
              <th className="p-3">Assigned To</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="border-b">
                <td className="p-3">{asset.id}</td>
                <td className="p-3">{asset.type}</td>
                <td className="p-3">{asset.name}</td>
                <td className="p-3">{asset.date}</td>
                <td className="p-3">{asset.status}</td>
                <td className="p-3">{asset.assignedTo || "—"}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleReissue(asset.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                  >
                    Reissue
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* History Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Deleted Assets History</h2>
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Asset ID</th>
              <th className="p-3">Type</th>
              <th className="p-3">Name</th>
              <th className="p-3">Date Added</th>
              <th className="p-3">Assigned To</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((asset, index) => (
              <tr key={index} className="border-b text-gray-500">
                <td className="p-3">{asset.id}</td>
                <td className="p-3">{asset.type}</td>
                <td className="p-3">{asset.name}</td>
                <td className="p-3">{asset.date}</td>
                <td className="p-3">{asset.assignedTo || "—"}</td>
                <td className="p-3">{asset.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
