// pages/Register.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [file, setFile] = useState(null); // 👈 FILE STATE

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
        setLoading(true);

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
          "http://localhost:5000/api/auth/register",
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
        setLoading(false);
        console.log(err.response);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 to-blue-600">
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
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

        <small className="text-green-500 block text-center mb-3">
          {successMsg}
        </small>

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={formik.handleChange}
          value={formik.values.username}
          className="w-full mb-2 p-3 border rounded-lg"
        />
        <p className="text-red-500 text-xs mb-2">{formik.errors.username}</p>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={formik.handleChange}
          value={formik.values.email}
          className="w-full mb-2 p-3 border rounded-lg"
        />
        <p className="text-red-500 text-xs mb-2">{formik.errors.email}</p>

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={formik.handleChange}
          value={formik.values.password}
          className="w-full mb-2 p-3 border rounded-lg"
        />
        <p className="text-red-500 text-xs mb-2">{formik.errors.password}</p>

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
          className="bg-blue-600 text-white w-full py-3 rounded-lg mt-2 hover:bg-blue-700"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p
          className="text-center text-sm mt-4 cursor-pointer text-gray-500 hover:text-blue-600"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
};

export default Register;
