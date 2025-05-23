import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Shield, Video, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-64"
        >
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Book Expert Developers for
              <span className="text-primary-600 dark:text-primary-400">
                {' '}
                Live Work Sessions
              </span>{' '}
              Instantly
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-primary-100 mb-8 max-w-2xl mx-auto"
            >
              Connect with top developers in real-time for pair programming,
              code reviews, and technical guidance.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/developers"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Find a Developer
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Profile
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Connect Wallet
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-dark-100 p-6 rounded-xl border border-gray-200 dark:border-primary-600/20 hover:border-primary-600/50 dark:hover:border-primary-600/50 transition-all duration-300">
              <div className="bg-primary-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-primary-600 dark:text-primary-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Secure Payments
              </h3>
              <p className="text-gray-600 dark:text-primary-100">
                Your payment is held securely in escrow until your session is
                complete
              </p>
            </div>
            <div className="bg-white dark:bg-dark-100 p-6 rounded-xl border border-gray-200 dark:border-primary-600/20 hover:border-primary-600/50 dark:hover:border-primary-600/50 transition-all duration-300">
              <div className="bg-primary-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Video className="text-primary-600 dark:text-primary-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Real-time Video Calls
              </h3>
              <p className="text-gray-600 dark:text-primary-100">
                Crystal clear video calls with screen sharing capabilities
              </p>
            </div>
            <div className="bg-white dark:bg-dark-100 p-6 rounded-xl border border-gray-200 dark:border-primary-600/20 hover:border-primary-600/50 dark:hover:border-primary-600/50 transition-all duration-300">
              <div className="bg-primary-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-primary-600 dark:text-primary-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Instant Booking
              </h3>
              <p className="text-gray-600 dark:text-primary-100">
                Book sessions instantly based on developer availability
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
