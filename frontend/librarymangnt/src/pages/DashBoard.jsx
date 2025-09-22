// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = ({
  borrowedBooks: borrowedProp,
  returnedBooks: returnedProp,
}) => {
  // support both shapes: useAuth() => { user, setUser } OR just user
  const auth = useAuth();
  const user = auth?.user ?? auth;
  const navigate = useNavigate();

  const [borrowedBooks, setBorrowedBooks] = useState(
    Array.isArray(borrowedProp) ? borrowedProp : []
  );
  const [returnedBooks, setReturnedBooks] = useState(
    Array.isArray(returnedProp) ? returnedProp : []
  );
  const [loading, setLoading] = useState(false);

  // keep state synced if parent updates props
  useEffect(() => {
    if (Array.isArray(borrowedProp)) setBorrowedBooks(borrowedProp);
    if (Array.isArray(returnedProp)) setReturnedBooks(returnedProp);
  }, [borrowedProp, returnedProp]);

  // If props not provided, try fetching from API (optional)
  useEffect(() => {
    const shouldFetch =
      !Array.isArray(borrowedProp) && !Array.isArray(returnedProp);
    if (!shouldFetch) return;

    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bRes, rRes] = await Promise.all([
          axios.get("http://localhost:8000/user/borrowed/books", {
            withCredentials: true,
          }),
          axios.get("http://localhost:8000/user/returned/books", {
            withCredentials: true,
          }),
        ]);
        if (!mounted) return;
        setBorrowedBooks(bRes.data?.borrowedBooks ?? bRes.data ?? []);
        setReturnedBooks(rRes.data?.returnedBooks ?? rRes.data ?? []);
      } catch (err) {
        console.error("fetch dashboard data", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [borrowedProp, returnedProp]);

  const totalBorrowed =
    (borrowedBooks?.length || 0) + (returnedBooks?.length || 0);
  const currentlyBorrowed = borrowedBooks?.length || 0;
  const totalReturned = returnedBooks?.length || 0;

  const formatDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    if (isNaN(dt)) return "-";
    return dt.toLocaleDateString();
  };

  return (
    <div className="p-6 mt-20 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-md md:col-span-1">
          {/* Row: Image + Details */}
          <div className="flex items-center gap-4">
            <img
              src={user?.profilephoto}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {user?.fullname ?? user?.username ?? "Guest"}
              </h2>
              <p className="text-sm text-gray-500">{user?.email ?? ""}</p>
            </div>
          </div>

          {/* Borrowed / Returned / Fines */}
          <div className="mt-6 text-sm space-y-2">
            <div className="flex">
              <span className="w-32">Borrowed Books</span>
              <span className="font-semibold">{currentlyBorrowed}</span>
            </div>
            <div className="flex">
              <span className="w-32">Returned Books</span>
              <span className="font-semibold">{totalReturned}</span>
            </div>
            <div className="flex">
              <span className="w-32">Pending Fines</span>
              <span className="font-semibold text-red-500">$0</span>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
          <h3 className="text-sm">Total Borrowed Books</h3>
          <p className="text-3xl font-bold">{totalBorrowed}</p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
          <h3 className="text-sm">Returned Books</h3>
          <p className="text-3xl font-bold">{totalReturned}</p>
        </div>

        <div className="bg-orange-400 text-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
          <h3 className="text-sm">Currently Borrowed</h3>
          <p className="text-3xl font-bold">{currentlyBorrowed}</p>
        </div>
      </div>

      {/* Current Borrowed Books preview */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Current Borrowed Books</h3>
          <button
            onClick={() => navigate("/borrowed")}
            className="text-blue-600 text-sm"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            <div>Loading...</div>
          ) : borrowedBooks.length === 0 ? (
            <p className="text-gray-500">No borrowed books</p>
          ) : (
            borrowedBooks.slice(0, 4).map((item) => (
              <div
                key={item._id}
                className="bg-gray-50 p-3 rounded-lg shadow flex flex-col"
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                  <img
                    src={
                      item.book_id?.thumbnailphoto ||
                      "https://via.placeholder.com/200x250"
                    }
                    alt={item.book_id?.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="mt-3 font-semibold text-sm">
                  {item.book_id?.name}
                </h4>
                <p className="text-xs text-gray-500">
                  by {item.book_id?.author?.fullname ?? "Unknown"}
                </p>
                <p className="text-xs text-gray-400">
                  Genre: {item.book_id?.genre ?? "-"}
                </p>
                <p className="text-xs mt-2">
                  Return by:{" "}
                  <span className="text-red-500">
                    {formatDate(item.returnAt)}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recently Returned + Reminders */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4">Recently Returned Books</h3>
          {returnedBooks.length === 0 ? (
            <p className="text-gray-500">No recently returned</p>
          ) : (
            returnedBooks.slice(0, 3).map((item) => (
              <div key={item._id} className="flex items-center gap-4 mb-4">
                <img
                  src={
                    item.book_id?.thumbnailphoto ||
                    "https://via.placeholder.com/80"
                  }
                  alt={item.book_id?.name}
                  className="h-16 w-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold text-sm">
                    {item.book_id?.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {item.book_id?.author?.fullname}
                  </p>
                  <p className="text-xs text-gray-400">
                    Returned At:{" "}
                    {formatDate(
                      item.returnedAt ?? item.updatedAt ?? item.returnAt
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4">Reminders</h3>
          {borrowedBooks.length === 0 ? (
            <p className="text-gray-500">No reminders</p>
          ) : (
            borrowedBooks.slice(0, 5).map((item) => (
              <p key={item._id} className="text-sm mb-2">
                Return <b>{item.book_id?.name}</b> by{" "}
                <span className="text-red-500">
                  {formatDate(item.returnAt)}
                </span>
              </p>
            ))
          )}

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Actions</h4>
            <ul className="text-sm text-blue-600 space-y-2">
              <li>🔍 Search Books</li>
              <li>📚 Borrowed Books Page</li>
              <li>✅ Returned Books Page</li>
              <li>⚙️ Manage Profile</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
