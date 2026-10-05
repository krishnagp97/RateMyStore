import { Navigate } from "react-router-dom";

function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === "USER") {
    return <Navigate to="/stores" replace />;
  }

  if (user.role === "OWNER") {
    return <Navigate to="/owner" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default Home;

