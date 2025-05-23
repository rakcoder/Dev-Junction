import { asyncHandler } from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

class UserController {
  // @desc    Get user profile
  // @route   GET /api/users/profile
  // @access  Private
  getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-addressHash');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json({
      success: true,
      data: user
    });
  });

  // @desc    Update user profile
  // @route   PUT /api/users/profile
  // @access  Private
  updateProfile = asyncHandler(async (req, res) => {
    const {
      name,
      email,
      phone,
      bio,
      skills,
      hourlyRate,
      githubUrl,
      linkedinUrl,
      websiteUrl,
      availability,
      imageUrl,
      status
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (skills && user.role === 'developer') user.skills = skills;
    if (hourlyRate && user.role === 'developer') user.hourlyRate = hourlyRate;
    if (githubUrl) user.githubUrl = githubUrl;
    if (linkedinUrl) user.linkedinUrl = linkedinUrl;
    if (websiteUrl) user.websiteUrl = websiteUrl;
    if (availability && user.role === 'developer') user.availability = availability;
    if (imageUrl) user.imageUrl = imageUrl;
    if (status) user.status = status;

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: updatedUser
    });
  });

  // @desc    Get all developers
  // @route   GET /api/users/developers
  // @access  Public
  getDevelopers = asyncHandler(async (req, res) => {
    const developers = await User.find({ 
      role: 'developer' 
    });

    res.json({
      success: true,
      data: developers
    });
  });
  // @desc    Get developer by ID
  // @route   GET /api/users/developers/:id
  // @access  Public
  getDeveloperById = asyncHandler(async (req, res) => {
    const developer = await User.findOne({ 
      _id: req.params.id,
      role: 'developer'
    });

    if (!developer) {
      throw new ApiError(404, 'Developer not found');
    }

    res.json({
      success: true,
      data: developer
    });
  });

}

export default new UserController();