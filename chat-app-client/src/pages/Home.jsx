import React from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-linear-to-br from-blue-500 to-indigo-600">
      <button
        onClick={() => document.documentElement.classList.toggle("dark")}
        className="absolute px-3 py-1 text-sm bg-gray-200 rounded top-4 right-4 dark:bg-gray-700"
      >
        Toggle Theme
      </button>
      <div className="bg-white rounded-3xl shadow-xl p-10 w-[90%] max-w-md text-center animate-fadeIn">
        <h1 className="mb-3 text-3xl font-bold text-gray-800">Welcome 👋</h1>

        <p className="mb-6 text-gray-500">
          Chat with friends in real-time. Fast, simple, and secure.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/register")}
            className="py-3 font-semibold text-white transition bg-blue-500 rounded-xl hover:bg-blue-700 "
          >
            Create Account
          </button>

          <button
            onClick={() => navigate("/login")}
            className="py-3 font-semibold text-blue-600 transition border border-blue-600 rounded-xl hover:bg-blue-50"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
