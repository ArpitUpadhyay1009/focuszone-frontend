import "./DashboardSection.css"
import React from "react";
import InfoCard from "../infoCard/InfoCard";
import { FaUsers, FaClock, FaTasks, FaMoon, FaSun } from "react-icons/fa";

const DashboardSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <InfoCard title="Total Users" value="21" icon={<FaUsers />} />
      <InfoCard title="Focus Time Avg" value="45 mins" icon={<FaClock />} />
      <InfoCard title="Todos/User Avg" value="6.2" icon={<FaTasks />} />
      <InfoCard title="Dark Mode %" value="78%" icon={<FaMoon />} />
      <InfoCard title="Light Mode %" value="22%" icon={<FaSun />} />
    </div>
  );
};

export default DashboardSection;
