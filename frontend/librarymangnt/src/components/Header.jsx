import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import handIcon from "../assets/hand_wave.png";
import libLogo from "../assets/LibImage.webp";
import LogoutPopUp from "./LogoutPopUp";
import axios from "axios";
const Headers = () => {
  const { user, setUser } = useAuth();
  const [profileOpen, setprofileOpen] = useState(false);
  const [showLogoutPopUp, setShowLogoutPopUp] = useState(false);

  const linksClasses = ({ isActive }) => {
    return isActive ? "font-bold text-red-600" : "text-white font-sm";
  };
  const handleLogout = async () => {
    try {
      // Attempt to send the logout request to the server
      await axios.post(
        "http://localhost:8000/logout",
        {},
        { withCredentials: true }
      );
      // On success, continue with client-side cleanup
    } catch (error) {
      // Log the error for debugging purposes
      console.log(
        "Error during logout:",
        error.response?.data?.error || "Unknown error"
      );
      // Even if there's an error from the server, we must still clean up the client-side state
      // The server is telling us the session is already invalid, so we should treat this as a successful logout from the client's perspective
    } finally {
      // These actions MUST happen regardless of the server's response
      setShowLogoutPopUp(false);
      setUser(null); // Clear the user state in your context
      localStorage.removeItem("user"); // Clear the user from localStorage
    }
  };
  return (
    <div>
      <nav className="fixed  shadow-gray-700 bg-black w-full h-25  flex items-center justify-between px-7 top-0 left-0 z-50 shadow-lg transition-all">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-14 object-cover rounded-xl"
            src={libLogo}
            alt="logo"
          />
          {user && (
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <img src={handIcon} alt="" className="h-6" />
              Hey {user.username}
            </h1>
          )}
        </div>
        <div className="flex gap-1 ">
          <input
            type="text"
            className="bg-white w-full px-5 py-2 rounded-lg border-none outline-none"
            placeholder="Search"
          />
          <button className="bg-gray-500 px-5 py-2 rounded-lg text-white font-semibold hover:bg-gray-600">
            Search
          </button>
        </div>

        <ul className="flex flex-row gap-4 ">
          <li>
            <NavLink to="/" className={linksClasses}>
              Home
            </NavLink>
          </li>
          {!user ? (
            <>
              <li>
                <NavLink to="/login" className={linksClasses}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={linksClasses}>
                  Register
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/dashboard" className={linksClasses}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/borrowed" className={linksClasses}>
                  Borrowed
                </NavLink>
              </li>
              <li>
                <NavLink to="/returned" className={linksClasses}>
                  Returned
                </NavLink>
              </li>
              <div
                className="relative inline-block"
                onMouseEnter={() => setprofileOpen(true)}
                onMouseLeave={() => setprofileOpen(false)}
              >
                <button className="bg-green-700 text-white rounded-full flex justify-center items-center h-8 w-8">
                  {user.username ? user.username.charAt(0).toUpperCase() : "?"}
                </button>

                {profileOpen && (
                  <div className=" right-0  w-40 bg-gray-600  border-0 rounded-lg shadow-lg  fixed">
                    <ul>
                      <li>
                        <NavLink
                          to="/profile"
                          className="block px-4 py-2 text-white hover:bg-gray-700"
                        >
                          Profile
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/bookmarks"
                          className="block px-4 py-2 text-white hover:bg-gray-700"
                        >
                          Bookmarks
                        </NavLink>
                      </li>
                      <li>
                        <button
                          onClick={() => setShowLogoutPopUp(true)}
                          className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </ul>
      </nav>
      {showLogoutPopUp && (
        <LogoutPopUp
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutPopUp(false)}
        />
      )}
    </div>
  );
};

export default Headers;
