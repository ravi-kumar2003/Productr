import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-16 bg-gray-100 flex items-center justify-between px-6 border-b relative z-50">
      {/* Left */}
      <h1 className="text-xl font-semibold">Home</h1>

      {/* Right */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Services, Products"
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        {/* Profile Icon */}
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400"
        >
          👤
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg">
            <div className="px-4 py-3 border-b">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="text-sm font-medium truncate">
                {user?.email || "Unknown User"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
