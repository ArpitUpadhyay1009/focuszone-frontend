import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Replace current route so user can’t go back
    navigate("/login", { replace: true });

    // Optional: clear browser history using history API
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
      navigate("/login", { replace: true });
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-[#7500CA] text-white font-medium font-[Poppins] px-4 py-2 md:px-5 md:py-2 sm:px-4 sm:py-2 text-lg md:text-base sm:text-sm rounded-lg transition-all hover:scale-105 duration-300 cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
