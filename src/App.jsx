import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CaretakerDashboard from "./pages/CaretakerDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import CreateTenant from "./pages/CreateTenant";
import Tenants from "./pages/Tenants";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/caretaker" element={<CaretakerDashboard />} />
        <Route path="/tenant" element={<TenantDashboard />} />
        <Route path="/create-tenant" element={<CreateTenant />} />
        <Route path="/allTenants" element={<Tenants />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
