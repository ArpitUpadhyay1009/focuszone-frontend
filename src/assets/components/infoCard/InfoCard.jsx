import React from "react";
import "./InfoCard.css"; // Import the CSS file for styling

const InfoCard = ({ title, value, icon, bgColor = "bg-white", textColor = "text-gray-800" }) => {
  return (
    <div className={`p-4 rounded-2xl shadow-md ${bgColor} ${textColor} flex items-center justify-between`}>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  );
};

export default InfoCard;
