import React, { useState } from "react";

function EmployeeDashboard() {
  const [request, setRequest] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (request) {
      alert(`Your ${request} request has been sent to the Manager.`);
      setRequest(""); // reset after submitting
    } else {
      alert("Please select a request type.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#124191] to-blue-500 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-96">
        <h1 className="text-2xl font-bold text-[#124191] mb-6 text-center">
          Employee Dashboard
        </h1>

        {/* Profile Card */}
        <div className="p-4 border rounded-lg bg-gray-50 mb-6">
          <p><strong>ID:</strong> EMP123</p>
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> employee@test.com</p>
          <p><strong>Manager:</strong> Jane Smith</p>
          <p><strong>Call Center:</strong> Bangalore</p>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block font-medium text-gray-700">
            Raise a Request:
          </label>
          <select
            className="w-full border rounded-lg p-2"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="Return">Return Asset</option>
            <option value="Replacement">Replacement Request</option>
          </select>

          <button
            type="submit"
            className="w-full bg-[#124191] text-white rounded-lg p-3 font-medium hover:bg-blue-800 transition"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
