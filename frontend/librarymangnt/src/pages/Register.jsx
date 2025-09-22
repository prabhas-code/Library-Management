import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import personIcon from "../assets/person_icon.svg";
import mailIcon from "../assets/mail_icon.svg";
import lockIcon from "../assets/lock_icon.svg";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    role: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (profilePhoto) {
        data.append("profilephoto", profilePhoto);
      }

      const res = await axios.post("http://localhost:8000/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // send cookies
      });

      console.log(res);

      toast.success(res.data.message || "Registration successful");
      console.log("User data:", res.data.user);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-indigo-100 to-indigo-300 flex items-center-safe justify-center ">
      <div className="px-6 py-6 w-sm mx-auto bg-black rounded-xl shadow-md mt-18 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Create Acount</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center gap-3 border px-4 py-3  bg-[#333A5C] rounded-full">
            <img src={personIcon} alt="Person Icon" className="w-6 h-5" />
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              className="rounded outline-none border-0  text-white"
              required
            />
          </div>
          <div className="flex items-center gap-3 border px-4 py-3  bg-[#333A5C] rounded-full">
            <img src={personIcon} alt="Person Icon" className="w-6 h-5" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="rounded outline-none border-0  text-white"
              required
            />
          </div>

          <div className="flex items-center gap-3 border px-4 py-3  bg-[#333A5C] rounded-full">
            <img src={mailIcon} alt="Person Icon" className="w-6 h-5" />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="rounded outline-none border-0  text-white"
              required
            />
          </div>
          <div className="flex items-center gap-3 border px-4 py-3  bg-[#333A5C] rounded-full">
            <img src={lockIcon} alt="Person Icon" className="w-6 h-5" />
            <input
              type="text"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="rounded outline-none border-0  text-white"
              required
            />
          </div>
          <div className="flex items-center gap-3 border px-4 py-3 bg-[#333A5C] rounded-full">
            <img src={personIcon} alt="Person Icon" className="w-6 h-5" />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="bg-transparent text-white outline-none border-0 rounded w-full"
              required
            >
              <option
                className="bg-[#333A5C] border-0 outline-none border-bg-[#333A5C] rounded-full text-white"
                value=""
              >
                Select Gender
              </option>
              <option
                className="bg-[#333A5C] border-0 outline-none border-bg-[#333A5C] rounded-2xl text-white"
                value="male"
              >
                Male
              </option>
              <option
                className="bg-[#333A5C] border-0 outline-none border-bg-[#333A5C] rounded-2xl text-white"
                value="female"
              >
                Female
              </option>
            </select>
          </div>

          <div className="flex items-center gap-3 border px-4 py-3 bg-[#333A5C] rounded-full">
            <img src={personIcon} alt="Person Icon" className="w-6 h-5" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="bg-transparent text-white outline-none border-0 rounded w-full"
              required
            >
              <option value="">Role</option>
              <option value="user">User</option>
              <option value="author">Author</option>
            </select>
          </div>
          {/* <div className="flex items-center gap-3 border px-4 py-3 bg-[#333A5C] rounded-full">
            
            <h1>📁</h1>

           
            <input
              type="file"
              name="profilephoto"
              accept="image/*"
              onChange={handleFileChange}
              className="text-white"
            />
          </div> */}

          <button
            type="submit"
            className="bg-gradient-to-b from-blue-300 to-blue-500  text-white py-2 px-4 rounded hover:bg-none hover:bg-blue-700 mt-2 font-semibold"
          >
            Register
          </button>
        </form>
        <div className="text-center gap-2.5 mt-3">
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="text-gray-500"
          >
            if already registered?
            <span className="text-red-600 underline ml-2">Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
