import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router"; // Add this import

function ForgotPassword() {
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // Track message type (success/error)
  const [loading, setloading] = useState(false);
  const navigate = useNavigate(); // Add navigation

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      setloading(true);
      setMsg("");
      setMsgType("");

      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/forgot-password",
          values,
        );

        // Handle different response formats
        if (res.data.message) {
          setMsg(res.data.message);
        } else if (typeof res.data === "string") {
          setMsg(res.data);
        } else {
          setMsg("Password reset link sent to your email!");
        }

        setMsgType("success");

        // Optional: Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        console.error("Forgot password error:", err);

        // Handle different error response formats
        if (err.response?.data?.message) {
          setMsg(err.response.data.message);
        } else if (typeof err.response?.data === "string") {
          setMsg(err.response.data);
        } else if (err.response?.data === "User not found") {
          setMsg("No account found with this email address");
        } else {
          setMsg("Something went wrong. Please try again.");
        }

        setMsgType("error");
      } finally {
        setloading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-[90%] max-w-md"
      >
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-800 dark:text-white">
          Forgot Password
        </h2>

        {/* Show message with different colors based on type */}
        {msg && (
          <p
            className={`mb-3 text-center ${
              msgType === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {msg}
          </p>
        )}

        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={loading}
          value={formik.values.email}
          className={`w-full p-3 mb-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
            formik.touched.email && formik.errors.email ? "border-red-500" : ""
          }`}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="mb-2 text-xs text-red-500">{formik.errors.email}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-3 text-white transition rounded-lg ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Add back to login button */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full py-2 mt-3 text-sm text-gray-600 transition bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
