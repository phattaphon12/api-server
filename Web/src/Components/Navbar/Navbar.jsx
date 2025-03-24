// Navbar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../../drone-svgrepo-com.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <NavLink
              to="/"
              className="ml-2 text-white text-lg font-semibold flex items-center"
            >
              <img src={logo} alt="" className="h-5 mr-2" />
              DRONE
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:ml-6">
            <div className="flex space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-white border-b-2 border-indigo-500"
                      : "text-gray-300 hover:text-white hover:border-indigo-300"
                  }`
                }
              >
                Config
              </NavLink>

              <NavLink
                to="/temp"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-white border-b-2 border-indigo-500"
                      : "text-gray-300 hover:text-white hover:border-indigo-300"
                  }`
                }
              >
                Temperature
              </NavLink>

              <NavLink
                to="/logs"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-white border-b-2 border-indigo-500"
                      : "text-gray-300 hover:text-white hover:border-indigo-300"
                  }`
                }
              >
                Logs
              </NavLink>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="h-6 w-6 transition-transform duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 transition-transform duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive
                  ? "text-white bg-gray-900"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Config
          </NavLink>

          <NavLink
            to="/temp"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive
                  ? "text-white bg-gray-900"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Temperature
          </NavLink>

          <NavLink
            to="/logs"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive
                  ? "text-white bg-gray-900"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Logs
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
