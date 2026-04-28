import { useParams, useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { newPassword: "" },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setMsg("");
      try {
        await axios.post(
         `${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`,
          { newPassword: values.newPassword },
        );
        console.log("Reset Token: ", token);

        setMsg("Password reset successful 🎉, redirecting to Login Page...");

        setTimeout(() => navigate("/login"), 3000);
      } catch {
        setMsg("Invalid or expired link ❌");
      } finally {
        setLoading(false);
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
          Reset Password
        </h2>

        <p className="mb-3 text-sm text-center text-green-500">{msg}</p>

        <input
          type="password"
          name="newPassword"
          placeholder="New password"
          onChange={formik.handleChange}
          value={formik.values.newPassword}
          className="w-full p-3 mb-2 border rounded-lg dark:bg-gray-700 dark:text-white"
        />
        <p className="mb-2 text-xs text-red-500">{formik.errors.newPassword}</p>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white rounded-lg ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
