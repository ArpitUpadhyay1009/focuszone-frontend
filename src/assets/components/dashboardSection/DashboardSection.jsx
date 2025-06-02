import "./DashboardSection.css"
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import InfoCard from "../infoCard/InfoCard";
import { FaUsers, FaClock, FaTasks, FaMoon, FaSun } from "react-icons/fa";

const DashboardSection = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [stats, setStats] = useState({ avgOngoingTasks: 0, avgCompletedTasks: 0 });
  const [error, setError] = useState(null);
  const [averageTime, setAverageTime] = useState(null);
  const [mostUsed, setMostUsed] = useState(null);

  const fetchTotalUsers = async () => {
    try {
      const response = await axios.get('/api/admin/totalRegistered'); // Update the endpoint if needed
      setTotalUsers(response.data.totalRegistered);
    } catch (err) {
      setError('Failed to fetch total users');
    }
  };

  useEffect(() => {
    fetchTotalUsers();
  }, []);

  const fetchAverageTime = async () => {
    try {
      const response = await axios.get('/api/admin/averageTime'); // adjust if your base URL differs
      setAverageTime(response.data.averageTimeInMinutes);
    } catch (err) {
      setError('Failed to fetch average time.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAverageTime();
  }, []);
  useEffect(() => {
    const getAverageTasks = async () => {
      try {
        const res = await axios.get("/api/admin/average-tasks");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching average tasks:", error);
      }
    };

    getAverageTasks();
  }, []);

  useEffect(() => {
    axios.get('/api/most-used')
      .then(res => setMostUsed(res.data))
      .catch(err => {
        console.error('Error fetching most used browser:', err);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <InfoCard title="Total Users" value={totalUsers} icon={<FaUsers />} />
      <InfoCard title="Focus Time Avg" value={averageTime} icon={<FaClock />} />
      <InfoCard title="Ongoing Todos/User Avg" value={stats.avgOngoingTasks} icon={<FaTasks />} />
      <InfoCard title="Completed Todos/User Avg" value={stats.avgCompletedTasks} icon={<FaTasks />} />
      {mostUsed? (<InfoCard title="Most used brower" value={mostUsed.browser} />) : (<InfoCard title="Most used Browser" value="Collecting data" />)}
      <InfoCard title="Dark Mode %" value="78%" icon={<FaMoon />} />
      <InfoCard title="Light Mode %" value="22%" icon={<FaSun />} />
    </div>
  );
};

export default DashboardSection;
