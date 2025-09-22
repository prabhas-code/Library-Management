import React, { useEffect, useState } from "react";
import Headers from "../components/Header";
import Home from "./Home";
import Cookies from "js-cookie";
import axios from "axios";
import BookCard from "../components/BookCard";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Headers />

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
