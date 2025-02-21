import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProtectedPage = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized! Please log in.");
      navigate("/login"); // Redirect if no token
      return;
    }

    axios
      .get("http://localhost:3001/api/protected-data", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setData(response.data); // Store data in state
      })
      .catch((error) => {
        console.error("Error fetching protected data:", error);
        alert("Session expired! Please log in again.");
        localStorage.removeItem("token"); // Clear token if expired
        navigate("/login"); // Redirect to login
      });
  }, [navigate]);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold">Protected Data</h2>
      {data ? <p>{JSON.stringify(data)}</p> : <p>Loading...</p>}
    </div>
  );
};

export default ProtectedPage;
