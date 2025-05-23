import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const availabilitySchema = new mongoose.Schema({
  monday: [String],
  tuesday: [String],
  wednesday: [String],
  thursday: [String],
  friday: [String]
});

const userSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'Wallet address is required'],
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  role: {
    type: String,
    enum: ['developer', 'customer'],
    required: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Must be at least 18 years old']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['available', 'unavailable', 'busy'],
    default: 'available'
  },
  email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    sparse: true
  },
  phone: {
    type: String,
    sparse: true
  },
  bio: {
    type: String,
    maxLength: [500, 'Bio cannot be more than 500 characters']
  },
  skills: [{
    type: String
  }],
  hourlyRate: {
    type: Number,
    min: 0
  },
  githubUrl: String,
  linkedinUrl: String,
  websiteUrl: String,
  availability: {
    type: availabilitySchema,
    required: function() {
      return this.role === 'developer';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash the wallet address before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('address')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.addressHash = await bcrypt.hash(this.address.toLowerCase(), salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

export default mongoose.model('User', userSchema);