import React, { useState } from "react";

function AdminDashboard() {
  const [assets, setAssets] = useState([
    { id: 1, machineNumber: "LAP12345", type: "Laptop", status: "Assigned", assignedTo: "EMP001" },
    { id: 2, machineNumber: "LAP98765", type: "Laptop", status: "Returned", assignedTo: "EMP002" },
  ]);

  const [newAsset, setNewAsset] = useState({
    machineNumber: "",
    type: "Laptop",
    status: "Available",
    assignedTo: "",
  });

  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // handle form input changes
  const handleChange = (e, setFunc, data) => {
    setFunc({ ...data, [e.target.name]: e.target.value });
  };

  // add new asset
  const handleAdd = (e) => {
    e.preventDefault();
    const newEntry = { id: Date.now(), ...newAsset };
    setAssets([...assets, newEntry]);
    setNewAsset({ machineNumber: "", type: "Laptop", status: "Available", assignedTo: "" });
  };

  // edit asset
  const handleEditClick = (asset) => {
    setEditId(asset.id);
    setEditFormData(asset);
  };

  // save edit
  const handleSave = () => {
    setAssets(assets.map((a) => (a.id === editId ? editFormData : a)));
    setEditId(null);
  };

  // delete asset
  const handleDelete = (id) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-red-700">Admin Dashboard</h1>

      {/* Add New Asset Form */}
      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input
          type="text"
          name="machineNumber"
          placeholder="Machine Number"
          value={newAsset.machineNumber}
          onChange={(e) => handleChange(e, setNewAsset, newAsset)}
          className="border rounded p-2"
          required
        />
        <select
          name="type"
          value={newAsset.type}
          onChange={(e) => handleChange(e, setNewAsset, newAsset)}
          className="border rounded p-2"
        >
          <option>Laptop</option>
          <option>Desktop</option>
          <option>Tablet</option>
        </select>
        <select
          name="status"
          value={newAsset.status}
          onChange={(e) => handleChange(e, setNewAsset, newAsset)}
          className="border rounded p-2"
        >
          <option>Available</option>
          <option>Assigned</option>
          <option>Returned</option>
          <option>Scrapped</option>
        </select>
        <input
          type="text"
          name="assignedTo"
          placeholder="Assigned To (EMP ID)"
          value={newAsset.assignedTo}
          onChange={(e) => handleChange(e, setNewAsset, newAsset)}
          className="border rounded p-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Asset
        </button>
      </form>

      {/* Assets Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Machine Number</th>
            <th className="border border-gray-300 px-4 py-2">Type</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Assigned To</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) =>
            editId === asset.id ? (
              <tr key={asset.id}>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    name="machineNumber"
                    value={editFormData.machineNumber}
                    onChange={(e) => handleChange(e, setEditFormData, editFormData)}
                    className="border rounded p-1"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    name="type"
                    value={editFormData.type}
                    onChange={(e) => handleChange(e, setEditFormData, editFormData)}
                    className="border rounded p-1"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={(e) => handleChange(e, setEditFormData, editFormData)}
                    className="border rounded p-1"
                  >
                    <option>Available</option>
                    <option>Assigned</option>
                    <option>Returned</option>
                    <option>Scrapped</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    name="assignedTo"
                    value={editFormData.assignedTo}
                    onChange={(e) => handleChange(e, setEditFormData, editFormData)}
                    className="border rounded p-1"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={asset.id}>
                <td className="border border-gray-300 px-4 py-2">{asset.machineNumber}</td>
                <td className="border border-gray-300 px-4 py-2">{asset.type}</td>
                <td className="border border-gray-300 px-4 py-2">{asset.status}</td>
                <td className="border border-gray-300 px-4 py-2">{asset.assignedTo}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEditClick(asset)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
