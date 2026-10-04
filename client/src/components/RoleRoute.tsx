import { Navigate, Outlet } from "react-router-dom";

interface RoleRouteProps {
  allowedRoles: string[];
}

function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;