import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  import { generateRandomId } from '../lib/utils';

  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const uniqueId = generateRandomId();

  return (
    <nav className="fixed w-full bg-white/80 dark:bg-dark-100/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-primary-600/20 transition-colors duration-200">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${uniqueId}`}>
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Dev Junction {uniqueId}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/developers"
              className="text-gray-600 dark:text-primary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Find Developers
            </Link>
            {user ? (
              <>
                <Link
                  to={`/${user.role}/dashboard`}
                  className="text-gray-600 dark:text-primary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-600/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatAddress(user.address)}
                        </span>
                        <span className="text-xs text-primary-600 dark:text-primary-400 capitalize">
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-primary-100" />
                  </button>

                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-100 rounded-xl shadow-lg border border-gray-200 dark:border-primary-600/20 overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-primary-100 hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </div>
                <ThemeToggle />
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Login
                </Link>
                <ThemeToggle />
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-primary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, height: 'auto' },
          closed: { opacity: 0, height: 0 },
        }}
        className="md:hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-dark-100">
          <Link
            to="/developers"
            className="block px-3 py-2 text-gray-600 dark:text-primary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Find Developers
          </Link>
          {user ? (
            <>
              <Link
                to={`/${user.role}/dashboard`}
                className="block px-3 py-2 text-gray-600 dark:text-primary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 text-gray-600 dark:text-primary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="block px-3 py-2 text-gray-600 dark:text-primary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="block px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </nav>
  );
};