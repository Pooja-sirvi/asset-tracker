import React, { useState } from "react";

function ManagerDashboard() {
  const [employees, setEmployees] = useState([
    {
      id: "EMP001",
      name: "Pooja Sirvi",
      email: "pooja.sirvi@nokia.com",
      machineNumber: "LAP12345",
      status: "Assigned",
    },
    {
      id: "EMP002",
      name: "Rahul Mehta",
      email: "rahul.mehta@nokia.com",
      machineNumber: "LAP98765",
      status: "Assigned",
    },
  ]);

  const [editId, setEditId] = useState(null); // track which row is being edited
  const [editFormData, setEditFormData] = useState({
    machineNumber: "",
    status: "",
  });

  // handle edit click
  const handleEditClick = (emp) => {
    setEditId(emp.id);
    setEditFormData({
      machineNumber: emp.machineNumber,
      status: emp.status,
    });
  };

  // handle input change
  const handleChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // handle save
  const handleSave = (id) => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === id
        ? { ...emp, machineNumber: editFormData.machineNumber, status: editFormData.status }
        : emp
    );
    setEmployees(updatedEmployees);
    setEditId(null); // exit edit mode
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Manager Dashboard</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Machine Number</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td className="border border-gray-300 px-4 py-2">{emp.id}</td>
              <td className="border border-gray-300 px-4 py-2">{emp.name}</td>
              <td className="border border-gray-300 px-4 py-2">{emp.email}</td>

              {/* If row is in edit mode */}
              {editId === emp.id ? (
                <>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      name="machineNumber"
                      value={editFormData.machineNumber}
                      onChange={handleChange}
                      className="border rounded p-1"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleChange}
                      className="border rounded p-1"
                    >
                      <option>Assigned</option>
                      <option>Returned</option>
                      <option>Scrapped</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleSave(emp.id)}
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
                </>
              ) : (
                <>
                  <td className="border border-gray-300 px-4 py-2">{emp.machineNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{emp.status}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEditClick(emp)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                    >
                      Edit
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerDashboard;
