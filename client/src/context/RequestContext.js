import React, { createContext, useState } from "react";

// Create Context
export const RequestContext = createContext();

// Context Provider
export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);

  // Function to add a new request
  const addRequest = (newRequest) => {
    setRequests((prev) => [...prev, { id: prev.length + 1, ...newRequest }]);
  };

  // Function to update request status
  const updateRequestStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  return (
    <RequestContext.Provider value={{ requests, addRequest, updateRequestStatus }}>
      {children}
    </RequestContext.Provider>
  );
};
