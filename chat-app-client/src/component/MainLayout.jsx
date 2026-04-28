import React from "react";
import { Outlet } from "react-router";
import ThemeToggle from "./ThemeToggle";

const MainLayout = () => {
  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900">
      <ThemeToggle />
      <Outlet />
    </div>
  );
};

export default MainLayout;
