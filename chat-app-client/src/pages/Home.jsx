import React from "react";
import { useNavigate } from "react-router";


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-[90%] max-w-md text-center animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Welcome 👋</h1>

        <p className="text-gray-500 mb-6">
          Chat with friends in real-time. Fast, simple, and secure.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition "
          >
            Create Account
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
