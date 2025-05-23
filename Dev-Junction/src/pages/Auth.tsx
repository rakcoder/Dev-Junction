import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  User,
  Code2,
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  Github,
  Linkedin,
  Globe,
  Clock,
  Plus,
  X,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type UserRole = 'developer' | 'customer';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  age:number;
  bio: string;
  skills: string[];
  hourlyRate?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  availability?: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
  };
}

const timeSlots = [
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
];

const weekDays = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
] as const;
const defaultAvailability = {
  monday: ["9:00 AM", "2:00 PM", "4:00 PM"],
  tuesday: ["10:00 AM", "3:00 PM"],
  wednesday: ["9:00 AM", "1:00 PM", "5:00 PM"],
  thursday: ["11:00 AM", "4:00 PM"],
  friday: ["9:00 AM", "2:00 PM"]
};


export const Auth = () => {
  const navigate = useNavigate();
  const { login, connectWallet, checkWalletAuth, isAuthenticated, user } =
    useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    skills: [],
    hourlyRate: 120,
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
    availability: defaultAvailability,
    age:0 
  });

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const address = await connectWallet();
      const existingUser = await checkWalletAuth(address);

      if (existingUser) {
        await login();
      } else {
        setShowForm(true);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const toggleTimeSlot = (
    day:any,
    time: string
  ) => {
    setProfileData((prev) => {
      const currentSlots = prev.availability?.[day] || [];
      const newSlots = currentSlots.includes(time)
        ? currentSlots.filter((slot) => slot !== time)
        : [...currentSlots, time].sort((a, b) => {
            const timeA = new Date(`1970/01/01 ${a}`).getTime();
            const timeB = new Date(`1970/01/01 ${b}`).getTime();
            return timeA - timeB;
          });

      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: newSlots,
        },
      };
    });
  };

  const handleInitialSubmit = () => {
    if (role) {
      setShowProfileForm(true);
    }
  };

  const handleSkillChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.target as HTMLInputElement;
      const skill = input.value.trim();
      if (skill && !profileData.skills.includes(skill)) {
        setProfileData((prev) => ({
          ...prev,
          skills: [...prev.skills, skill],
        }));
        input.value = '';
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleProfileSubmit = async () => {
    if (role && profileData.name && profileData.email) {
      try {
        await login({
          role,
          ...profileData,
        });
      } catch (error) {
        console.error('Failed to register:', error);
      }
    }
  };

  if (isAuthenticated && user) {
    navigate(
      user.role === 'developer' ? '/developer/dashboard' : '/customer/dashboard'
    );
    return null;
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-200">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-100 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {!showForm
                  ? 'Connect Your Wallet'
                  : showProfileForm
                  ? 'Complete Your Profile'
                  : 'Choose Your Role'}
              </h2>
              <p className="text-gray-600 dark:text-primary-100">
                {!showForm
                  ? 'Connect with MetaMask to continue'
                  : showProfileForm
                  ? 'Tell us more about yourself'
                  : 'Choose your role and enter your details'}
              </p>
            </div>

            {!showForm ? (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-primary-600 text-white py-4 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Wallet className="w-5 h-5" />
                )}
                <span>
                  {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                </span>
              </button>
            ) : showProfileForm ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={profileData.age}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        age: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="Enter your Age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>

                {role === 'developer' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                        Skills (Press Enter to add)
                      </label>
                      <input
                        type="text"
                        onKeyDown={handleSkillChange}
                        className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                        placeholder="Add a skill"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-primary-600/10 text-primary-600 dark:text-primary-400 rounded-full text-sm flex items-center gap-1"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="hover:text-red-500"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                        Hourly Rate ($)
                      </label>
                      <input
                        type="number"
                        value={profileData.hourlyRate}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            hourlyRate: parseInt(e.target.value),
                          }))
                        }
                        className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                        placeholder="Enter your hourly rate"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          value={profileData.githubUrl}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              githubUrl: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                          placeholder="GitHub profile"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={profileData.linkedinUrl}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              linkedinUrl: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                          placeholder="LinkedIn profile"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                          Website URL
                        </label>
                        <input
                          type="url"
                          value={profileData.websiteUrl}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              websiteUrl: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                          placeholder="Personal website"
                        />
                      </div>
                    </div>
                  </>
                )}
                {/* <div className="space-y-4">
                  <label className="block text-lg font-medium text-gray-900 dark:text-white">
                    Availability Schedule
                  </label>
                  <p className="text-sm text-gray-600 dark:text-primary-100">
                    Select your available time slots for each day
                  </p>

                  <div className="grid grid-cols-1 gap-6">
                    {weekDays.map(({ key, label }) => (
                      <div
                        key={key}
                        className="bg-gray-50 dark:bg-dark-200 rounded-xl p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            {label}
                          </h3>
                          <span className="text-sm text-primary-600 dark:text-primary-400">
                            {profileData.availability?.[key]?.length || 0} slots
                            selected
                          </span>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => toggleTimeSlot(key, time)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                profileData.availability?.[key]?.includes(time)
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-white dark:bg-dark-100 text-gray-700 dark:text-primary-100 hover:bg-primary-600/10'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}

                <button
                  onClick={handleProfileSubmit}
                  disabled={!profileData.name || !profileData.email}
                  className="w-full bg-primary-600 text-white py-4 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Complete Registration</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setRole('developer')}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      role === 'developer'
                        ? 'border-primary-600 bg-primary-600/10'
                        : 'border-gray-200 dark:border-primary-600/20'
                    }`}
                  >
                    <Code2 className="w-6 h-6 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                      Developer
                    </span>
                  </button>
                  <button
                    onClick={() => setRole('customer')}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      role === 'customer'
                        ? 'border-primary-600 bg-primary-600/10'
                        : 'border-gray-200 dark:border-primary-600/20'
                    }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                      Customer
                    </span>
                  </button>
                </div>

                <button
                  onClick={handleInitialSubmit}
                  disabled={!role}
                  className="w-full bg-primary-600 text-white py-4 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
