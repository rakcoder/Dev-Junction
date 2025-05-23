import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Github,
  Linkedin,
  Globe,
  Edit2,
  Plus,
  X,
  Save,
  Calendar,
  DollarSign,
  Star,
  Clock,
  Shield,
  Upload,
  AlertCircle,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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

export const Profile = () => {
  const { user, getProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    age: 0,
    bio: '',
    skills: [] as string[],
    hourlyRate: 0,
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
    imageUrl: '',
    status: 'available' as 'available' | 'unavailable' | 'busy',
    availability: {
      monday: [] as string[],
      tuesday: [] as string[],
      wednesday: [] as string[],
      thursday: [] as string[],
      friday: [] as string[],
    },
  });

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          age: data.age || 0,
          bio: data.bio || '',
          skills: data.skills || [],
          hourlyRate: data.hourlyRate || 0,
          githubUrl: data.githubUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          websiteUrl: data.websiteUrl || '',
          availability: data.availability || {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
          },
          imageUrl: data.imageUrl || '',
          status: data.status || 'unavailable',
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, getProfile]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError('');
      await updateProfile(profileData);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkillAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleSkillRemove = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const toggleTimeSlot = (
    day: keyof typeof profileData.availability,
    time: string
  ) => {
    setProfileData((prev) => {
      const currentSlots = prev.availability[day];
      const newSlots = currentSlots.includes(time)
        ? currentSlots.filter((slot) => slot !== time)
        : [...currentSlots, time].sort();

      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: newSlots,
        },
      };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-200 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Success Message */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="z-50 fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Profile updated successfully!</span>
          </motion.div>
        )}

        {/* Error Message */}
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{saveError}</span>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-100 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-primary-600/20"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                  <button
                    onClick={() =>
                      isEditing ? handleSave() : setIsEditing(true)
                    }
                    disabled={isSaving}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      isEditing
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 dark:bg-dark-200 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-300'
                    } transition-colors`}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : isEditing ? (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        disabled={!isEditing}
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
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        disabled={!isEditing}
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
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        disabled={!isEditing}
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
                            age: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        disabled={!isEditing}
                        min="18"
                        max="100"
                      />
                    </div>
                  </div>

                  {/* Bio */}
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
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      rows={4}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Social Links */}
                  <div className="grid md:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        disabled={!isEditing}
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
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        disabled={!isEditing}
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
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        disabled={!isEditing}
                      />
                    </div>

                    {user?.role === 'developer' && (
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
                              hourlyRate: parseInt(e.target.value) || 0,
                            }))
                          }
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          disabled={!isEditing}
                          min="0"
                          step="5"
                        />
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                      Skills
                    </label>
                    {isEditing && (
                      <input
                        type="text"
                        placeholder="Type a skill and press Enter"
                        onKeyDown={handleSkillAdd}
                        className="w-full px-4 py-2 mb-2 bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    )}
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-primary-600/10 text-primary-600 dark:text-primary-400 rounded-full text-sm flex items-center gap-2"
                        >
                          {skill}
                          {isEditing && (
                            <button
                              onClick={() => handleSkillRemove(skill)}
                              className="hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Availability Schedule */}
                  {user?.role === 'developer' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Availability Schedule
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {weekDays.map(({ key, label }) => (
                          <div
                            key={key}
                            className="bg-gray-50 dark:bg-dark-200 p-4 rounded-xl"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-primary-600 dark:text-primary-400 font-medium">
                                {label}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {timeSlots.map((time) => (
                                <button
                                  key={time}
                                  onClick={() =>
                                    isEditing && toggleTimeSlot(key, time)
                                  }
                                  disabled={!isEditing}
                                  className={`w-full px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    profileData.availability[key].includes(time)
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
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="grid lg:grid-cols-3 gap-8 mb-2 ">
              {/* Developer Status Card (New) */}
              {user?.role === 'developer' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-3 bg-white dark:bg-dark-100 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-primary-600/20 sticky top-24"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Developer Status
                        </h2>
                      </div>
                      {!isEditing && (
                        <div
                          className={`px-4 py-2 rounded-lg ${getStatusColor(
                            profileData.status
                          )}`}
                        >
                          {profileData.status.charAt(0).toUpperCase() +
                            profileData.status.slice(1)}
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="grid grid-cols-3 gap-4">
                        {['available', 'busy', 'unavailable'].map((status) => (
                          <button
                            key={status}
                            onClick={() =>
                              setProfileData((prev) => ({
                                ...prev,
                                status: status as any,
                              }))
                            }
                            className={`p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2 ${
                              profileData.status === status
                                ? `${getStatusColor(status)} border-transparent`
                                : 'border-gray-200 dark:border-primary-600/20'
                            }`}
                          >
                            <span className="text-lg font-medium">
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-primary-100">
                              {status === 'available'
                                ? 'Ready for sessions'
                                : status === 'busy'
                                ? 'In a session'
                                : 'Not taking sessions'}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              </div>
              <div className="grid lg:grid-cols-3 gap-8 mb-2">
              {/* Profile Image Section (New) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-3 bg-white dark:bg-dark-100 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-primary-600/20 sticky top-24"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Profile Image
                    </h2>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="relative">
                      {profileData.imageUrl ? (
                        <img
                          src={profileData.imageUrl}
                          alt={profileData.name}
                          className="w-32 h-32 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-100 dark:bg-dark-200 rounded-xl flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400 dark:text-primary-100/50" />
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-primary-100 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={profileData.imageUrl}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              imageUrl: e.target.value,
                            }))
                          }
                          placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 border border-gray-300 dark:border-primary-600/30 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                        <p className="mt-2 text-sm text-gray-600 dark:text-primary-100">
                          Recommended: Use a square image from a reliable source
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-100 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-primary-600/20 sticky top-24"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Profile Preview
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary-600/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {profileData.name || 'Your Name'}
                    </h3>
                    <p className="text-gray-600 dark:text-primary-100">
                      {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 dark:text-primary-100">
                    <p className="mb-2">
                      {profileData.bio || 'No bio added yet'}
                    </p>
                    <div className="space-y-1">
                      <p>
                        <Mail className="w-4 h-4 inline-block mr-2" />
                        {profileData.email || 'No email specified'}
                      </p>
                      <p>
                        <Phone className="w-4 h-4 inline-block mr-2" />
                        {profileData.phone || 'No phone specified'}
                      </p>
                      <p>
                        <Clock className="w-4 h-4 inline-block mr-2" />
                        Age: {profileData.age || 'Not specified'}
                      </p>
                      {user?.role === 'developer' && (
                        <p>
                          <DollarSign className="w-4 h-4 inline-block mr-2" />
                          Rate: ${profileData.hourlyRate}/hr
                        </p>
                      )}
                    </div>
                  </div>

                  {profileData.skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-primary-600/10 text-primary-600 dark:text-primary-400 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
