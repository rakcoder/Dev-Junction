import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  DollarSign,
  Video,
  Shield,
  ChevronRight,
  User,
  AlertCircle,
  Loader2,
  Zap,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MeetingRoom } from "../components/MeetingRoom";
import { useAuth } from "../contexts/AuthContext";
import { PaymentModal } from "../components/PaymentModal";
import { ethService } from "../services/ethService";

interface Developer {
  _id: string;
  name: string;
  hourlyRate: number;
  imageUrl: string;
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
  };
}

export const Booking = () => {
  const navigate = useNavigate();
  const { developerId } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [duration, setDuration] = useState(1);
  const [step, setStep] = useState(1);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [ethAmount, setEthAmount] = useState<string>("0");
  const [isLoadingEth, setIsLoadingEth] = useState(false);
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isInstantBooking, setIsInstantBooking] = useState(false);
  const { user } = useAuth();

  const totalCost = developer ? developer.hourlyRate * duration : 0;

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const response = await fetch(
          `https://dev-junction.onrender.com/api/users/developers/${developerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch developer details");
        }
        const data = await response.json();
        setDeveloper(data.data);
      } catch (err) {
        setError("Failed to load developer details");
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (developerId) {
      fetchDeveloper();
    }
  }, [developerId]);

  useEffect(() => {
    const updateEthAmount = async () => {
      if (totalCost > 0) {
        setIsLoadingEth(true);
        try {
          const eth = await ethService.convertUSDToETH(totalCost);
          setEthAmount(eth);
        } catch (error) {
          console.error("Failed to convert USD to ETH:", error);
        } finally {
          setIsLoadingEth(false);
        }
      }
    };

    updateEthAmount();
  }, [totalCost]);

  const handleInstantBooking = () => {
    setIsInstantBooking(true);
    const now = new Date();
    const bookingTime = new Date(now.getTime() + 5 * 60000); // Current time + 5 minutes
    setSelectedDate(bookingTime);
    setSelectedTime(
      bookingTime.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const getDayName = (date: Date): keyof Developer["availability"] => {
    const days: Record<number, keyof Developer["availability"]> = {
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
    };
    return days[date.getDay()] || "monday";
  };

  const getAvailableTimesForDate = (date: Date): string[] => {
    const dayName = getDayName(date);
    return developer?.availability[dayName] || [];
  };

  const handlePaymentSuccess = async (txHash: string) => {
    if (isProcessingBooking) return;

    try {
      setIsProcessingBooking(true);
      setShowPayment(false);

      const response = await fetch(
        "https://dev-junction.onrender.com/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            developerId: developer?._id,
            customerId: user?._id,
            date: selectedDate,
            time: selectedTime,
            duration,
            totalAmount: totalCost,
            txHash,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const data = await response.json();
      setBookingData(data.data);
      setStep(2);
    } catch (error) {
      console.error("Failed to create booking:", error);
    } finally {
      setIsProcessingBooking(false);
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedTime || !user || isProcessingBooking) {
      return;
    }
    setShowPayment(true);
  };

  const availableTimeSlots = getAvailableTimesForDate(selectedDate);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-200 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-gray-600 dark:text-primary-100">
            Loading developer details...
          </span>
        </div>
      </div>
    );
  }

  if (error || !developer) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-200 flex items-center justify-center">
        <div className="flex items-center gap-3 text-red-500">
          <AlertCircle className="w-6 h-6" />
          <span>{error || "Developer not found"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-200">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="booking-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-dark-100 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-8">
                  {developer.imageUrl ? (
                    <img
                      src={developer.imageUrl}
                      alt={developer.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary-600/10 rounded-xl flex items-center justify-center">
                      <User className="w-8 h-8 text-primary-600" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Book a Session with {developer.name}
                    </h2>
                    <p className="text-gray-600 dark:text-primary-100">
                      ${developer.hourlyRate}/hour
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Instant Booking Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={handleInstantBooking}
                      className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-colors ${
                        isInstantBooking
                          ? "bg-primary-600 text-white"
                          : "bg-primary-600/10 text-primary-600 dark:text-primary-400"
                      }`}
                    >
                      <Zap className="w-5 h-5" />
                      <span>Instant Booking (Start in 5 minutes)</span>
                    </button>
                  </div>

                  {/* Date and Time Selection (hidden when instant booking is selected) */}
                  {!isInstantBooking && (
                    <>
                      {/* Date Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                          Select Date
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                          {[...Array(6)].map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() + i);
                            const dayName = getDayName(date);
                            const hasAvailability =
                              developer.availability[dayName]?.length > 0;

                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  setSelectedDate(date);
                                  setSelectedTime(null);
                                }}
                                disabled={!hasAvailability}
                                className={`p-3 rounded-xl text-center transition-colors ${
                                  selectedDate.toDateString() ===
                                  date.toDateString()
                                    ? "bg-primary-600 text-white"
                                    : hasAvailability
                                    ? "bg-gray-50 dark:bg-dark-200 text-gray-900 dark:text-white hover:bg-primary-600/10"
                                    : "bg-gray-100 dark:bg-dark-300 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                }`}
                              >
                                <div className="text-sm font-medium">
                                  {date.toLocaleDateString("en-US", {
                                    weekday: "short",
                                  })}
                                </div>
                                <div className="text-lg font-semibold">
                                  {date.getDate()}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                          Available Time Slots
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {availableTimeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-3 rounded-xl text-center transition-colors ${
                                selectedTime === time
                                  ? "bg-primary-600 text-white"
                                  : "bg-gray-50 dark:bg-dark-200 text-gray-900 dark:text-white hover:bg-primary-600/10"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Duration Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                      Session Duration
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setDuration(Math.max(1, duration - 1))}
                        className="p-2 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-900 dark:text-white hover:bg-primary-600/10 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xl font-semibold text-gray-900 dark:text-white">
                        {duration} hour{duration > 1 ? "s" : ""}
                      </span>
                      <button
                        onClick={() => setDuration(Math.min(4, duration + 1))}
                        className="p-2 rounded-lg bg-gray-50 dark:bg-dark-200 text-gray-900 dark:text-white hover:bg-primary-600/10 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Cost Summary */}
                  <div className="bg-gray-50 dark:bg-dark-200 p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600 dark:text-primary-100">
                        Hourly Rate
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        ${developer.hourlyRate}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600 dark:text-primary-100">
                        Duration
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {duration} hours
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-primary-600/20 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          Total Cost
                        </span>
                        <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          ${totalCost}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-primary-100">
                        Estimated ETH
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {isLoadingEth ? (
                          <span className="animate-pulse">Loading...</span>
                        ) : (
                          `≈ ${parseFloat(ethAmount).toFixed(6)} ETH`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-primary-600/10 p-4 rounded-xl flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      Your payment will be held securely in escrow until the
                      session is complete. You'll receive a full refund if the
                      developer doesn't show up or if technical issues prevent
                      the session.
                    </p>
                  </div>

                  <button
                    onClick={handleConfirmBooking}
                    disabled={!selectedTime && !isInstantBooking}
                    className="w-full bg-primary-600 text-white py-4 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Confirm Booking</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <PaymentModal
            isOpen={showPayment}
            onClose={() => setShowPayment(false)}
            onSuccess={handlePaymentSuccess}
            amount={totalCost}
            developerAddress={developer.address}
            developerName={developer.name}
          />

          {step === 2 && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-dark-100 p-8 rounded-2xl shadow-xl"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-gray-600 dark:text-primary-100">
                  Your session has been scheduled successfully.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-dark-200 p-6 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-primary-100">
                        Date & Time
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        at {selectedTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-primary-100">
                        Duration
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {duration} hour{duration > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-primary-100">
                        Total Cost
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        ${totalCost}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-600/10 p-4 rounded-xl">
                  <MeetingRoom
                    bookingId={bookingData._id}
                    developerId={developer._id}
                    duration={bookingData.duration}
                    startDate={bookingData.date}
                    startTime={bookingData?.time}
                  />
                </div>

                <button
                  onClick={() => navigate("/customer/dashboard")}
                  className="w-full bg-primary-600 text-white py-4 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Go to Dashboard</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
