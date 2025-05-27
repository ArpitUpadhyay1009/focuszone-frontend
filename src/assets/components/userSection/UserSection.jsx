import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import UserCard from "../userCard/UserCard";

const UserSection = () => {
  const [users, setUsers] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("/api/auth/user-level", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setYourCoins(response.data.coins);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/totalRegistered", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Call the fetchUserData and fetchUsers functions
    fetchUserData();
    fetchUsers();
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default UserSection;
