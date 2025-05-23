import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Star, Clock, ChevronRight, Filter, User } from "lucide-react";
import { DeveloperProfile } from "../components/DeveloperProfile";
import { Link } from "react-router-dom";

interface Developer {
  _id: string;
  name: string;
  role: string;
  hourlyRate: number;
  rating?: number;
  skills: string[];
  imageUrl: string;
  status: "available" | "unavailable" | "busy";
  bio: string;
}

export const Developers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(
    null
  );
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch(
          "https://dev-junction.onrender.com/api/users/developers",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setDevelopers(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch developers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/20 text-green-600 dark:text-green-400";
      case "busy":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400";
      case "unavailable":
        return "bg-red-500/20 text-red-600 dark:text-red-400";
      default:
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-200 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-dark-200">
      {/* Developers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {developers.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-gray-600 dark:text-primary-100 py-12">
            <User className="w-16 h-16 text-gray-400 dark:text-primary-400 mb-4" />
            <h2 className="text-2xl font-semibold">No developers found</h2>
            <p className="mt-2 text-gray-500 dark:text-primary-200">
              Try adjusting your search or filters to find developers.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((dev, index) => (
              <motion.div
                key={dev._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white dark:bg-dark-100 rounded-2xl overflow-hidden border border-gray-200 dark:border-primary-600/20 hover:border-primary-600/50 dark:hover:border-primary-600/50 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 z-10">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      dev.status
                    )}`}
                  >
                    {dev.status}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={dev.imageUrl}
                      alt={dev.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {dev.name}
                      </h3>
                      <p className="text-gray-600 dark:text-primary-100">
                        {dev.role}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock className="w-5 h-5 text-gray-600 dark:text-primary-100" />
                        <span className="text-gray-900 dark:text-white font-medium">
                          ${dev.hourlyRate}/hr
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {dev.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-primary-600/10 text-primary-600 dark:text-primary-100 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedDeveloper(dev)}
                      className="flex items-center justify-center gap-2 bg-transparent border-2 border-primary-600 text-primary-600 dark:text-primary-400 px-4 py-3 rounded-xl hover:bg-primary-600/10 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>View Profile</span>
                    </button>

                    <Link
                      to={`/book/${dev._id}`}
                      className="flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-3 rounded-xl hover:bg-primary-700 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                      <span>Book Now</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Developer Profile Modal */}
      {selectedDeveloper && (
        <DeveloperProfile
          developer={selectedDeveloper}
          isOpen={!!selectedDeveloper}
          onClose={() => setSelectedDeveloper(null)}
        />
      )}
    </div>
  );
};
