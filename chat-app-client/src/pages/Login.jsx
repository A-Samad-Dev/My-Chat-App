// pages/Login.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/chat");
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          values,
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/chat");
      } catch (err) {
        setErrorMsg("Invalid credentials ❌");
        setLoading(false);
      }finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-br from-blue-500 to-indigo-600">
      <button
        className="absolute top-0 left-1 text-2xl"
        onClick={() => navigate("/")}
      >
        🏠 Home
      </button>
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md  dark:bg-black dark:text-white animate-fadeIn"
      >
        <h2 className="text-2xl font-bold text-gray-800  dark:text-white/80 mb-4 text-center">
          Welcome Back 👋
        </h2>

        <small className="text-red-500 block text-center mb-3">
          {errorMsg}
        </small>

        {/* Email */}
        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className={`w-full p-3 border rounded-lg outline-none focus:ring-2 
              ${formik.errors.email ? "border-red-400 ring-red-200" : "focus:ring-blue-300"}
            `}
          />
          <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
        </div>

        {/* Password */}
        <div className="mb-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className={`w-full p-3 border rounded-lg outline-none focus:ring-2 
              ${formik.errors.password ? "border-red-400 ring-red-200" : "focus:ring-blue-300"}
            `}
          />
          <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded-lg mt-3 hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          className="text-center text-sm text-gray-500 mt-4 cursor-pointer hover:text-blue-600"
          onClick={() => navigate("/register")}
        >
          Don’t have an account? Sign up
        </p>
      </form>
    </div>
  );
};

export default Login;
