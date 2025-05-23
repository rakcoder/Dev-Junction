import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Clock,
  DollarSign,
  Calendar,
  Star,
  Bell,
  MessageSquare,
  ArrowUpRight,
  Timer,
  Shield,
  Users,
  Filter,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { MeetingModal } from "../components/MeetingModal";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context";

export const CustomerDashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [developerProfile, setDeveloperProfile] = useState([]);
  const { getProfile } = useAuth();
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState({
    eth: "0",
    usd: "0",
    pending: "0",
  });
  const { account } = useWeb3();
  console.log(account, "account");

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (window.ethereum && account) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(account);
          const ethBalance = ethers.formatEther(balance);

          // Fetch ETH price in USD
          const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
          );
          const data = await response.json();
          const ethPrice = data.ethereum.usd;
          console.log(balance, "ugyjffyfyjfyj");

          const usdBalance = (parseFloat(ethBalance) * ethPrice).toFixed(2);

          setWalletBalance({
            eth: ethBalance,
            usd: usdBalance,
            pending: "0", // You can implement pending transactions logic if needed
          });
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
        }
      }
    };

    fetchWalletBalance();
    // Set up an interval to refresh balance
    const interval = setInterval(fetchWalletBalance, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [account]);

  useEffect(() => {
    const fetchUpcomingSessions = async () => {
      try {
        const data = await getProfile();

        const response = await fetch(
          `https://dev-junction.onrender.com/api/meetings/${data._id}/upcoming`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUpcomingSessions(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch upcoming sessions:", error);
      }
    };

    fetchUpcomingSessions();
  }, []);

  const stats = {
    totalSpent: 650,
    totalHours: 5,

    completedSessions: 8,
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 md:p-8 mb-8 text-white"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back!
              </h1>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2">
                <Video className="w-5 h-5" />
                <span>Quick Session</span>
              </button>
              <Link
                to={"/developers"}
                className="px-4 py-2 bg-white text-primary-600 rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                <span>Find Developer</span>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-1 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-16">
            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-primary-600/20"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Upcoming Sessions
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-gray-100 dark:bg-dark-200 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors">
                      <Filter className="w-5 h-5 text-gray-600 dark:text-primary-100" />
                    </button>
                    <button className="p-2 bg-gray-100 dark:bg-dark-200 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors relative">
                      <Bell className="w-5 h-5 text-gray-600 dark:text-primary-100" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        2
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session._id}
                      className="bg-gray-50 dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-primary-600/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={session.bookingId.developer.imageUrl}
                            alt={session.bookingId.developer.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {session.bookingId.developer.name}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-primary-100">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(session.startTime).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-primary-100">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(session.startTime).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-primary-100">
                          <Timer className="w-4 h-4" />
                          <span>
                            In{" "}
                            {Math.floor(
                              (new Date(session.startTime).getTime() -
                                new Date().getTime()) /
                                (1000 * 60)
                            )}{" "}
                            minutes
                          </span>
                        </div>
                      </div>
                      {selectedMeeting && (
                        <MeetingModal
                          isOpen={!!selectedMeeting}
                          onClose={() => setSelectedMeeting(null)}
                          meetingData={{
                            bookingId: selectedMeeting.bookingId._id,
                            developerId:
                              selectedMeeting.bookingId.developer._id,
                            duration: selectedMeeting.duration,
                            startTime: selectedMeeting.startTime,
                            startDate: new Date(selectedMeeting.startTime),
                          }}
                        />
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                          ${session.bookingId.totalAmount}
                        </span>
                        <div className="flex gap-2">
                          {new Date(session.startTime).getTime() -
                            new Date().getTime() <=
                            300000 && (
                            <button
                              onClick={() => setSelectedMeeting(session)}
                              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-1"
                            >
                              Join Meeting
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Past Sessions */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-100 rounded-xl shadow-sm border border-gray-200 dark:border-primary-600/20"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Past Sessions
                </h2>
                <div className="space-y-4">
                  {pastSessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-gray-50 dark:bg-dark-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={session.developer.image}
                            alt={session.developer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {session.developer.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-primary-100">
                              {session.topic}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                          Completed
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-primary-100">
                          <Calendar className="w-4 h-4" />
                          <span>{session.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-primary-100">
                          <Clock className="w-4 h-4" />
                          <span>{session.duration}hr</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-primary-100">
                          <DollarSign className="w-4 h-4" />
                          <span>${session.rate * session.duration}</span>
                        </div>
                      </div>
                      {session.feedback ? (
                        <div className="bg-white dark:bg-dark-100 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {session.feedback.rating}/5
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-primary-100">
                            {session.feedback.comment}
                          </p>
                        </div>
                      ) : (
                        <button className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                          Leave Feedback
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
