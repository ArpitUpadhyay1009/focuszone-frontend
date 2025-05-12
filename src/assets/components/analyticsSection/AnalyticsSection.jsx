import React from "react";
import InfoCard from "../infoCard/InfoCard";
import { FaClock, FaList, FaCoins, FaUser, FaMoon, FaSun } from "react-icons/fa";

const AnalyticsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <InfoCard title="Total Timer Sessions" value="1200" icon={<FaClock />} />
      <InfoCard title="Avg Focus Time/User" value="20 mins" icon={<FaUser />} />
      <InfoCard title="Avg Break Time/User" value="1 mins" icon={<FaClock />} />
      <InfoCard title="Avg Todos/User" value="0.23" icon={<FaList />} />
      <InfoCard title="Avg Coins/User" value="120" icon={<FaCoins />} />
      <InfoCard title="Highest Coins" value="920" icon={<FaCoins />} />
      <InfoCard title="Dark Mode Usage" value="78%" icon={<FaMoon />} />
      <InfoCard title="Light Mode Usage" value="22%" icon={<FaSun />} />
    </div>
  );
};

export default AnalyticsSection;
