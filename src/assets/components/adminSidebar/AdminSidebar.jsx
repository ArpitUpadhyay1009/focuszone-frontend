import React from "react";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menu = ["Dashboard", "Users", "Analytics", "Newsletter Subscribers"];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Admin</h2>
      <ul className="space-y-4">
        {menu.map((item) => (
          <li
            key={item}
            onClick={() => setActiveTab(item)}
            className={`cursor-pointer hover:text-blue-400 ${
              activeTab === item ? "text-blue-400 font-semibold" : ""
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AdminSidebar;
