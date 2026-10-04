import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>RateMyStore</h1>

      <p>Welcome, {user?.name}</p>
      <p>Role: {user?.role}</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Home;