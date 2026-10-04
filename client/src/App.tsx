import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserStores from "./pages/user/UserStores";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerAddStore from "./pages/owner/AddStore";
import AdminUsers from "./pages/admin/AdminUsers";
import AddUser from "./pages/admin/AddUser";
import AdminStores from "./pages/admin/AdminStores";
import AdminAddStore from "./pages/admin/AddStore";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/change-password" element={<ChangePassword />} />

          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/add" element={<AddUser />} />
            <Route path="/admin/stores" element={<AdminStores />} />
            <Route path="/admin/stores/add" element={<AdminAddStore />} />
            <Route path="/admin/users/:userId" element={<AdminUserDetails />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["USER"]} />}>
            <Route path="/stores" element={<UserStores />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["OWNER"]} />}>
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/owner/add-store" element={<OwnerAddStore />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
