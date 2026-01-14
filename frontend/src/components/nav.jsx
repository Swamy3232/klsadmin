import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const location = useLocation(); // Highlight active link

  const links = [
    { name: "Add New Member", path: "/add-member" },
    { name: "Accept/Reject Members", path: "/approve-members" },
    { name: "All Chitti", path: "/all-chitti" },
    { name: "Add New Collection", path: "/add-collection" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold">Admin Panel</div>
            <div className="hidden md:flex space-x-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 ${
                    location.pathname === link.path ? "bg-gray-700" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <button className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
