import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setloading] = useState(false);

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
        setloading(true);
        setErrorMsg("");

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          values,
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/chat");
      } catch (err) {
        setErrorMsg("Invalid credentials ❌");
        values.password = "";
      } finally {
        setloading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-linear-to-br from-blue-500 to-indigo-600">
      <button
        className="absolute top-0 text-2xl left-1"
        onClick={() => navigate("/")}
      >
        🏠 Home
      </button>
      <form
        data-aos="flip-left"
        data-aos-easing="ease-out-cubic"
        data-aos-duration="2000"
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md  dark:bg-black dark:text-white animate-fadeI"
      >
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-800 dark:text-white/80">
          Welcome Back 👋
        </h2>

        <small className="block mb-3 text-center text-red-500">
          {errorMsg}
        </small>

        {/* Email */}
        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            disabled={loading}
            onChange={formik.handleChange}
            value={formik.values.email}
            className={`w-full p-3 border rounded-lg outline-none focus:ring-2 
              ${formik.errors.email ? "border-red-400 ring-red-200" : "focus:ring-blue-300"}
            `}
          />
          <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
        </div>

        {/* Password */}
        <div className="mb-3">
          <input
            type="password"
            name="password"
            disabled={loading}
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className={`w-full p-3 border rounded-lg outline-none focus:ring-2 
              ${formik.errors.password ? "border-red-400 ring-red-200" : "focus:ring-blue-300"}
            `}
          />
          <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-3 text-white transition rounded-lg ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "processing..." : "login"}
        </button>

        <p
          className="mt-4 text-sm text-center text-gray-500 cursor-pointer hover:text-blue-600"
          onClick={() => navigate("/register")}
        >
          Don’t have an account? Sign up
        </p>
        <p
          className="mt-4 text-sm text-center text-blue-300 dark:text-white hover:cursor-pointer dark:hover:text-yellow-400 hover:text-yellow-400"
          onClick={() => {
            navigate("/forgot-password");
          }}
        >
          {" "}
          forgot password? click here
        </p>
      </form>
    </div>
  );
};

export default Login;
