import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CaretakerDashboard from "./pages/CaretakerDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import CreateTenant from "./pages/CreateTenant";
import Tenants from "./pages/Tenants";
import TenantProfile from "./pages/TenantProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/caretaker" element={<CaretakerDashboard />} />
        <Route path="/tenant" element={<TenantDashboard />} />
        <Route path="/create-tenant" element={<CreateTenant />} />
        <Route path="/allTenants" element={<Tenants />} />
        <Route path="/tenant/profile" element={<TenantProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
