import React, { useState } from "react";

function AdminDashboard() {
  const [assets, setAssets] = useState([
    {
      id: "LAP123",
      asset: "Laptop - Dell XPS",
      owner: "John Doe",
      status: "In Use",
      assignedDate: "2025-09-01",
      returnDate: "",
    },
    {
      id: "HS456",
      asset: "Headset - Logitech",
      owner: "Alice Smith",
      status: "Returned",
      assignedDate: "2025-08-15",
      returnDate: "2025-09-03",
    },
  ]);

  const [history, setHistory] = useState([
    {
      id: "MN789",
      asset: "Monitor - HP",
      owner: "Bob Lee",
      status: "Scrapped",
      assignedDate: "2025-07-20",
      returnDate: "",
    },
  ]);

  const [newId, setNewId] = useState("");
  const [newAsset, setNewAsset] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newAssignedDate, setNewAssignedDate] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("assets"); // "assets" | "history"

  const handleAction = (id, newStatus) => {
    setAssets((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              returnDate:
                newStatus === "Returned" ? new Date().toISOString().split("T")[0] : item.returnDate,
            }
          : item
      )
    );
    alert(`Asset ${id} marked as ${newStatus}`);
  };

  const handleDelete = (id) => {
    const assetToDelete = assets.find((a) => a.id === id);
    if (assetToDelete) {
      // Move to history
      setHistory([...history, { ...assetToDelete, status: "Deleted" }]);
      // Remove from active list
      setAssets(assets.filter((a) => a.id !== id));
      alert(`Asset ${id} moved to history`);
    }
  };

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!newId || !newAsset || !newOwner || !newAssignedDate) {
      alert("Please fill in all fields!");
      return;
    }
    const newEntry = {
      id: newId,
      asset: newAsset,
      owner: newOwner,
      status: "In Use",
      assignedDate: newAssignedDate,
      returnDate: "",
    };
    setAssets([...assets, newEntry]);
    setNewId("");
    setNewAsset("");
    setNewOwner("");
    setNewAssignedDate("");
  };

  // Filter assets by ID or Owner
  const filteredAssets = assets.filter(
    (a) =>
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#124191] to-blue-500 p-8">
      <div className="bg-white shadow-2xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#124191] mb-6 text-center">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "assets" ? "bg-[#124191] text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("assets")}
          >
            Active Assets
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "history" ? "bg-[#124191] text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>

        {activeTab === "assets" && (
          <>
            {/* Add Asset Form */}
            <form
              onSubmit={handleAddAsset}
              className="flex flex-col md:flex-row gap-4 mb-8"
            >
              <input
                type="text"
                placeholder="Asset ID"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                className="border p-2 rounded-lg flex-1"
              />
              <input
                type="text"
                placeholder="Asset Name"
                value={newAsset}
                onChange={(e) => setNewAsset(e.target.value)}
                className="border p-2 rounded-lg flex-1"
              />
              <input
                type="text"
                placeholder="Owner Name"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                className="border p-2 rounded-lg flex-1"
              />
              <input
                type="date"
                value={newAssignedDate}
                onChange={(e) => setNewAssignedDate(e.target.value)}
                className="border p-2 rounded-lg flex-1"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                ➕ Add Asset
              </button>
            </form>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by Asset ID or Owner"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
            </div>

            {/* Assets Table */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#124191] text-white">
                  <th className="border p-3">Asset ID</th>
                  <th className="border p-3">Asset</th>
                  <th className="border p-3">Owner</th>
                  <th className="border p-3">Status</th>
                  <th className="border p-3">Assigned Date</th>
                  <th className="border p-3">Return Date</th>
                  <th className="border p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="border p-3">{item.id}</td>
                    <td className="border p-3">{item.asset}</td>
                    <td className="border p-3">{item.owner}</td>
                    <td className="border p-3">{item.status}</td>
                    <td className="border p-3">{item.assignedDate}</td>
                    <td className="border p-3">{item.returnDate || "—"}</td>
                    <td className="border p-3 space-x-2">
                      <button
                        onClick={() => handleAction(item.id, "Reissued")}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                      >
                        Reissue
                      </button>
                      <button
                        onClick={() => handleAction(item.id, "Returned")}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                      >
                        Return
                      </button>
                      <button
                        onClick={() => handleAction(item.id, "Scrapped")}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                      >
                        Scrap
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAssets.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No assets found.</p>
            )}
          </>
        )}

        {activeTab === "history" && (
          <>
            <h2 className="text-xl font-bold text-[#124191] mb-4 text-center">
              Deleted Assets History
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="border p-3">Asset ID</th>
                  <th className="border p-3">Asset</th>
                  <th className="border p-3">Owner</th>
                  <th className="border p-3">Status</th>
                  <th className="border p-3">Assigned Date</th>
                  <th className="border p-3">Return Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="border p-3">{item.id}</td>
                    <td className="border p-3">{item.asset}</td>
                    <td className="border p-3">{item.owner}</td>
                    <td className="border p-3">{item.status}</td>
                    <td className="border p-3">{item.assignedDate}</td>
                    <td className="border p-3">{item.returnDate || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {history.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No deleted assets yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
