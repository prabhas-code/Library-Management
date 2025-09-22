import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import DashBoard from "./pages/DashBoard";
import Borrowed from "./pages/Borrowed";
import Returned from "./pages/Returned";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Borrow from "./pages/Borrow";
import Return from "./pages/Return";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />

            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />

              {/* protected route */}

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashBoard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/borrow"
                element={
                  <ProtectedRoute>
                    <Borrow />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/borrowed"
                element={
                  <ProtectedRoute>
                    <Borrowed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/return"
                element={
                  <ProtectedRoute>
                    <Return />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/returned"
                element={
                  <ProtectedRoute>
                    <Returned />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
        toastStyle={{
          borderRadius: "10px",
          color: "#fff",
          fontWeight: "500",
        }}
        progressStyle={{
          background: "linear-gradient(to right, #34d399, #3b82f6)",
        }}
      />
    </>
  );
}

export default App;
