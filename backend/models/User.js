const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: 'User',
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true, 
  },
  phone: {
    type: String,
    trim: true,
    sparse: true, 
  },
  password: {
    type: String,
    minlength: 6,
  },
  address: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, {
  timestamps: true,
});

userSchema.pre('validate', function (next) {
  if (!this.email && !this.phone) {
    this.invalidate('email', 'Either email or phone number is required');
    this.invalidate('phone', 'Either email or phone number is required');
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
