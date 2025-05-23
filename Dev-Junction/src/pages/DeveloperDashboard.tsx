import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Clock,
  DollarSign,
  Calendar,
  Star,
  Wallet,
  TrendingUp,
  Users,
  MessageSquare,
  Bell,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Timer,
  Shield,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { MeetingModal } from "../components/MeetingModal";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context";

export const DeveloperDashboard = () => {
  const [activeNotifications, setActiveNotifications] = useState(3);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);

  const { getProfile } = useAuth();
  const [walletBalance, setWalletBalance] = useState({
    eth: "0",
    usd: "0",
    pending: "0",
  });
  const { account } = useWeb3();
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

  const recentReviews = [
    {
      id: 1,
      customer: "Michael Scott",
      rating: 5,
      comment: "Excellent session! Very helpful and knowledgeable.",
      date: "2024-03-10",
      skills: ["React", "Performance"],
      reply:
        "Thank you for the kind words! Looking forward to our next session.",
    },
    {
      id: 2,
      customer: "Lisa Chen",
      rating: 4,
      comment: "Great communication and problem-solving skills.",
      date: "2024-03-08",
      skills: ["Node.js", "API Design"],
      reply: null,
    },
  ];

  const earnings = {
    total: 2880,
    pending: 450,
    monthly: 1200,
    trend: "+15%",
    transactions: [
      {
        id: 1,
        amount: 240,
        status: "completed",
        date: "2024-03-10",
        customer: "John Doe",
      },
      {
        id: 2,
        amount: 120,
        status: "pending",
        date: "2024-03-09",
        customer: "Alice Smith",
      },
    ],
  };

  const skillStats = [
    { name: "React", sessions: 15, rating: 4.9 },
    { name: "Node.js", sessions: 12, rating: 4.8 },
    { name: "TypeScript", sessions: 8, rating: 4.7 },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top Stats Grid */}

        <div className="grid lg:grid-cols-1 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Earnings Chart */}

            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-100 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-primary-600/20"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Upcoming Sessions
                  </h2>
                  <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session._id}
                      className="bg-gray-50 dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-primary-600/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-600/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {session.bookingId.customer.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-primary-100">
                              {session.bookingId.topic}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            session.status === "scheduled"
                              ? "bg-green-500/10 text-green-600 dark:text-green-400"
                              : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                          }`}
                        >
                          {session.status.charAt(0).toUpperCase() +
                            session.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
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
                          <span>{session.duration} hour(s)</span>
                        </div>
                      </div>
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
          </div>

          {selectedMeeting && (
            <MeetingModal
              isOpen={!!selectedMeeting}
              onClose={() => setSelectedMeeting(null)}
              meetingData={{
                bookingId: selectedMeeting.bookingId._id,
                developerId: selectedMeeting.bookingId.developer._id,
                duration: selectedMeeting.duration,
                startTime: selectedMeeting.startTime,
                startDate: new Date(selectedMeeting.startTime),
              }}
            />
          )}

          {/* Right Sidebar */}
          {/* <div className="space-y-8"> */}
          {/* Wallet Card */}
          {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 text-white"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Wallet className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Wallet Balance</h3>
                </div>
                <button
                  onClick={() =>
                    window.open(
                      `https://etherscan.io/address/${account}`,
                      '_blank'
                    )
                  }
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-3xl font-bold mb-2">${walletBalance.usd}</p>
              <div className="flex items-center gap-2 text-primary-100">
                <span className="text-sm">
                  ETH: {parseFloat(walletBalance.eth).toFixed(4)}
                </span>
                <span className="text-sm">•</span>
                <span className="text-sm">
                  Pending: ${walletBalance.pending}
                </span>
              </div>
              <button
                onClick={() =>
                  window.open('https://app.uniswap.org/#/swap', '_blank')
                }
                className="w-full mt-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                Swap Tokens
              </button>
            </motion.div> */}

          {/* </div> */}
        </div>
      </div>
    </div>
  );
};
