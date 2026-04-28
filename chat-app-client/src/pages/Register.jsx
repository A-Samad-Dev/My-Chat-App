// pages/Register.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/chat");
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6).required("Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        // append text fields
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
        });

        // omo..., this is the part where we append the file to the formData, if it exists
        if (file) {
          formData.append("avatar", file);
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/register`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setSuccessMsg("Account created 🎉 Redirecting...");

        setTimeout(() => navigate("/"), 2000);
      } catch (err) {
        console.log(err.response);
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-linear-to-br from-indigo-500 to-blue-600">
      <button
        className="absolute top-0 text-2xl left-1"
        onClick={() => navigate("/")}
      >
        🏠 Home
      </button>
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md  dark:bg-black dark:text-white animate-fadeIn"
      >
        <h2 className="mb-4 text-2xl font-bold text-center">Create Account</h2>

        <small className="block mb-3 text-center text-green-500">
          {successMsg}
        </small>

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={formik.handleChange}
          value={formik.values.username}
          className="w-full p-3 mb-2 border rounded-lg"
        />
        <p className="mb-2 text-xs text-red-500">{formik.errors.username}</p>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={formik.handleChange}
          value={formik.values.email}
          className="w-full p-3 mb-2 border rounded-lg"
        />
        <p className="mb-2 text-xs text-red-500">{formik.errors.email}</p>

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={formik.handleChange}
          value={formik.values.password}
          className="w-full p-3 mb-2 border rounded-lg"
        />
        <p className="mb-2 text-xs text-red-500">{formik.errors.password}</p>

        <div className="mb-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Sign Up
        </button>

        <p
          className="mt-4 text-sm text-center text-gray-500 cursor-pointer hover:text-blue-600"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
};

export default Register;
