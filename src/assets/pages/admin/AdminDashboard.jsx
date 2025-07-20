import React, { useState } from "react";
import AdminSidebar from "@components/adminSidebar/AdminSidebar";
import DashboardSection from "@components/dashboardSection/DashboardSection";
import UsersSection from "../../components/userSection/UserSection";
import AnalyticsSection from "@components/analyticsSection/AnalyticsSection";
// import SettingsSection from "@components/settingsSection/SettingSection";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  

  const renderSection = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardSection />;
      case "Users":
        return <UsersSection />;
      case "Analytics":
        return <AnalyticsSection />;
      // case "Settings":
        // return <SettingsSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-black">{activeTab}</h1>
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminPanel;
