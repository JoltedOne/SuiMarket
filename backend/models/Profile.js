const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  name: { type: String, default: 'New Collector' },
  rank: { type: String, default: 'Bronze Collector' },
  profileImage: { type: String, default: 'default-profile' }, // Could store image URLs or IDs
  bannerImage: { type: String, default: 'default-banner' }, // Could store image URLs or IDs
  bio: { type: String, default: '' },
  social: {
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  achievements: [
    { name: { type: String }, icon: { type: String } }
  ],
  collections: [
    {
      id: { type: Number },
      name: { type: String },
      creator: { type: String },
      price: { type: String },
      image: { type: String },
      type: { type: String },
      date: { type: Date }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add middleware to update the updatedAt timestamp
profileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile; 