import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import mailIcon from "../assets/mail_icon.svg";
import lockIcon from "../assets/lock_icon.svg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/login",
        formData,
        { withCredentials: true }
      );

      setUser(response.data.userData);
      localStorage.setItem("user", JSON.stringify(response.data.userData));
      setFormData({ email: "", password: "" });

      // ✅ Success toast
      toast.success(response.data.message || "Login successful 🎉");

      // Navigate after a short delay
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (error) {
      // ❌ Error toast
      toast.error(
        error.response?.data?.message || "Something went wrong during login"
      );
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-indigo-100 to-indigo-300 flex items-center-safe justify-center">
      <div className="px-6 py-6 min-w-sm mx-auto bg-black rounded-xl shadow-md mt-18 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Login to your Account
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div className="flex items-center gap-3 border px-4 py-3  bg-[#333A5C] rounded-full">
            <img src={mailIcon} alt="Mail Icon" className="w-6 h-5" />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="rounded outline-none border-0 bg-transparent text-white"
              required
            />
          </div>
          <div className="flex items-center gap-3 border px-4 py-3  bg-[#333A5C] rounded-full">
            <img src={lockIcon} alt="Lock Icon" className="w-6 h-5" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="rounded outline-none border-0 bg-transparent text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-b from-blue-300 to-blue-500 text-white py-2 px-4 rounded hover:bg-none hover:bg-blue-700 mt-2 font-semibold"
          >
            Login
          </button>
        </form>
        <div className="text-center gap-2.5 mt-3">
          <button
            onClick={() => navigate("/register", { replace: true })}
            className="text-gray-500"
          >
            Don't have an account?
            <span className="text-red-600 underline ml-2">SignUp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
