import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserDropdown from './UserDropdown';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const currentPage = location.pathname === '/dashboard' ? 'Home' : 'Products';

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-gray-200 px-6 py-4 flex items-center justify-between border-b border-gray-300">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-slate-800">
              {currentPage}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Services, Products"
                className="px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <UserDropdown />
          </div>
        </header>

        
        <main className="flex-1 p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
