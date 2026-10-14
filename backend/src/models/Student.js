const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Za-z0-9\-_/]+$/, 'Student ID can only contain letters, numbers, hyphens, and slashes'],
      minlength: [2, 'Student ID must be at least 2 characters'],
      maxlength: [20, 'Student ID cannot exceed 20 characters'],
    },
    name: {
      type: String,
      required: [true, 'Student full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: {
        values: [
          'Computer Science & Engineering',
          'Information Technology',
          'Electronics & Communication',
          'Mechanical Engineering',
          'Civil Engineering',
          'Electrical & Electronics',
          'Business Administration',
          'Data Science & AI',
        ],
        message: '{VALUE} is not a valid department',
      },
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
      match: [
        /^[+]?[0-9\s\-()]{7,16}$/,
        'Please provide a valid contact number (7-15 digits)',
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for text search across name and studentId
studentSchema.index({ name: 'text', studentId: 'text' });

module.exports = mongoose.model('Student', studentSchema);
