import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface MeetingRoomProps {
  bookingId: string;
  duration: number;
  startTime: string;
  startDate: Date;
  developerId: string;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
  bookingId,
  duration,
  startTime,
  startDate,
  developerId,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [meeting, setMeeting] = useState<any>(null);
  const { user } = useAuth();

  const formatDateTime = (date: Date, time: string) => {
    const timeStr = String(time);
    const [rawTime, period] = timeStr.split(" ");
    const [hours, minutes] = rawTime.split(":");

    let hour24 = parseInt(hours);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;

    const dateObj = new Date(date);
    dateObj.setHours(hour24);
    dateObj.setMinutes(parseInt(minutes));
    dateObj.setSeconds(0);
    dateObj.setMilliseconds(0);

    return dateObj.toISOString();
  };
  const token = localStorage.getItem("token");
  useEffect(() => {
    const initializeMeeting = async () => {
      try {
        setIsLoading(true);
        // First check if meeting exists
        const checkResponse = await fetch(
          `https://dev-junction.onrender.com/api/meetings/booking/${bookingId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Add token to headers
            },
          }
        );
        const checkData = await checkResponse.json();
        if (checkData.data) {
          // Meeting exists, use it
          setMeeting(checkData.data);
        } else {
          // Create new meeting if none exists
          const formattedDateTime = formatDateTime(startDate, startTime);

          const response = await fetch(
            "https://dev-junction.onrender.com/api/meetings",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                bookingId,
                startTime: formattedDateTime,
                duration,
                createdBy: user?._id,
                meetingUrl: `https://video-call-app-uamc.vercel.app/room/${bookingId}`,
                participants: [
                  {
                    userId: user?._id,
                    role: user?.role,
                  },
                  {
                    userId: developerId,
                    role: "developer",
                  },
                ],
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to create meeting");
          }

          const data = await response.json();
          setMeeting(data.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to initialize meeting room");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      initializeMeeting();
    }
  }, [bookingId, startTime, duration, user, startDate, developerId]);

  if (isLoading) {
    return <div>Loading meeting room...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!meeting) {
    return <div>No meeting found</div>;
  }

  return (
    <h1 className="text-white font-bold">
      Meeting url created: {meeting.meetingUrl}
    </h1>
  );
};
