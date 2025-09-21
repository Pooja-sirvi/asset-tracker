
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TeamAssetManagerDashboard from "./pages/TeamAssetManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard"; // if you already have this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/teamassetmanager" element={<TeamAssetManagerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Optional: redirect default path to login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
