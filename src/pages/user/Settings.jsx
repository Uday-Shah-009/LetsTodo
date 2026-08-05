import { Link } from "@tanstack/react-router";
import React from "react";

const settings = () => {
  return (
    <Link to="/change-password" className="bg-blue-500">
      <button className="bg-blue-500 px-3 py-2 rounded-lg cursor-pointer  text-white">Change Password</button>
    </Link>
  );
};

export default settings;