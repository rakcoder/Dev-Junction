import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { MeetingRoom } from './MeetingRoom';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingData: {
    bookingId: string;
    developerId: string;
    duration: number;
    startTime: string;
    startDate: Date;
  };
}

export const MeetingModal = ({
  isOpen,
  onClose,
  meetingData,
}: MeetingModalProps) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime =
        new Date(meetingData.startDate).getTime() +
        meetingData.duration * 60 * 60 * 1000;
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft('Meeting ended');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    const timer = setInterval(updateTimeLeft, 1000);
    updateTimeLeft();

    return () => clearInterval(timer);
  }, [meetingData]);

  console.log(meetingData);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-6xl h-[90vh] bg-gray-900 rounded-xl overflow-hidden"
          >
            {/* Header with Timer */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gray-800/90 backdrop-blur-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{timeLeft}</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-gray-700/50 text-white hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meeting Room */}
            <div className="h-full pt-16 z-50">
              <iframe
                title="Video"
                src={`https://video-call-app-uamc.vercel.app/room/${meetingData.bookingId}`}
                className="w-full h-full"
                allow="camera; microphone"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
