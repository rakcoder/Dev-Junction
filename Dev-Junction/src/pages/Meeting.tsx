import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MeetingRoom } from "../components/MeetingRoom";
import { useAuth } from "../contexts/AuthContext";

export const Meeting = () => {
  const { meetingId } = useParams();
  const [meeting, setMeeting] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await fetch(
          `https://dev-junction.onrender.com/api/meetings/${meetingId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch meeting details");
        }
        const data = await response.json();
        setMeeting(data.data);
      } catch (err) {
        setError("Failed to load meeting details");
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (meetingId) {
      fetchMeeting();
    }
  }, [meetingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-200 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-200 flex items-center justify-center">
        <div className="text-red-500">{error || "Meeting not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <MeetingRoom
          bookingId={meeting.bookingId}
          duration={meeting.duration}
          startTime={meeting.startTime}
          startDate={new Date(meeting.startTime)}
          developerId={
            meeting.participants.find((p: any) => p.role === "developer").userId
          }
        />
      </div>
    </div>
  );
};
