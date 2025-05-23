import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Clock,
  Calendar,
  Video,
  MessageSquare,
  Shield,
  ChevronRight,
  Github,
  Linkedin,
  Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Developer {
  _id: string;
  name: string;
  role: string;
  hourlyRate: number;
  rating?: number;
  skills: string[];
  imageUrl: string;
  status: 'available' | 'unavailable' | 'busy';
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
  };
}

interface DeveloperProfileProps {
  developer: Developer;
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperProfile = ({
  developer,
  isOpen,
  onClose,
}: DeveloperProfileProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'busy':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'unavailable':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative min-h-screen md:flex md:items-center md:justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-5xl w-full bg-white dark:bg-dark-100 rounded-2xl shadow-xl overflow-hidden">
              {/* Header Section */}
              <div className="relative h-48 bg-gradient-to-r from-primary-600 to-primary-400">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative px-6 pb-6 md:px-8 md:pb-8">
                {/* Profile Info */}
                <div className="relative -mt-24 mb-8 flex flex-col md:flex-row gap-6 items-start">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={developer.imageUrl}
                    alt={developer.name}
                    className="w-32 h-32 rounded-2xl object-cover ring-4 ring-white dark:ring-dark-100"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {developer.name}
                        </h2>
                        <p className="text-primary-600 dark:text-primary-400 font-medium">
                          {developer.role}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button className="p-2 rounded-xl bg-primary-600/10 text-primary-600 dark:text-primary-400 hover:bg-primary-600/20 transition-colors">
                          <Github className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-xl bg-primary-600/10 text-primary-600 dark:text-primary-400 hover:bg-primary-600/20 transition-colors">
                          <Linkedin className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {developer.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-primary-600/10 text-primary-600 dark:text-primary-400 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-1">
                      <Star className="w-5 h-5" />
                      <span className="font-medium">Rating</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {developer.rating || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-1">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${developer.hourlyRate}/hr
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-1">
                      <Video className="w-5 h-5" />
                      <span className="font-medium">Sessions</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      124
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-1">
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-medium">Reviews</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      48
                    </p>
                  </div>
                </div>

                {/* About Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    About
                  </h3>
                  <p className="text-gray-600 dark:text-primary-100 leading-relaxed">
                    {developer.bio}
                  </p>
                </div>

                {/* Availability Calendar */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  {Object.entries(developer.availability).filter(([key]) => key !== '_id').map(
                    ([day, slots]) => (
                      <div
                        key={day}
                        className="bg-gray-50 dark:bg-dark-200 p-4 rounded-xl"
                      >
                        <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </p>
                        <div className="space-y-2">
                          {Array.isArray(slots)
                            ? slots.map((slot) => (
                                <button
                                  key={slot}
                                  className="w-full px-3 py-1 text-sm bg-white dark:bg-dark-100 text-gray-900 dark:text-white rounded-lg hover:bg-primary-600/10 dark:hover:bg-primary-600/20 transition-colors"
                                >
                                  {slot}
                                </button>
                              ))
                            : null}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Reviews Section */}
                {/* <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Reviews</h3>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 dark:bg-dark-200 p-4 rounded-xl">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.avatar}
                            alt={review.author}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{review.author}</h4>
                              <span className="text-sm text-gray-500 dark:text-primary-100">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              ))}
                            </div>
                            <p className="text-gray-600 dark:text-primary-100">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}

                    
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/book/${developer._id}`} className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Book a Session</span>
                  </Link>
                  <button className="flex-1 border-2 border-primary-600 text-primary-600 dark:text-primary-400 px-6 py-3 rounded-xl hover:bg-primary-600/10 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
