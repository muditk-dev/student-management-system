const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Student = require('../src/models/Student');

const sampleStudents = [
  {
    studentId: 'CS2026-001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    department: 'Computer Science & Engineering',
    semester: 6,
    contactNumber: '+91 98765 43210',
  },
  {
    studentId: 'CS2026-002',
    name: 'Priya Patel',
    email: 'priya.patel@college.edu',
    department: 'Computer Science & Engineering',
    semester: 4,
    contactNumber: '+91 98123 45678',
  },
  {
    studentId: 'IT2026-015',
    name: 'Rohan Verma',
    email: 'rohan.verma@college.edu',
    department: 'Information Technology',
    semester: 6,
    contactNumber: '+91 97234 56789',
  },
  {
    studentId: 'AI2026-008',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@college.edu',
    department: 'Data Science & AI',
    semester: 2,
    contactNumber: '+91 98345 67890',
  },
  {
    studentId: 'EC2026-042',
    name: 'Vikram Singh',
    email: 'vikram.singh@college.edu',
    department: 'Electronics & Communication',
    semester: 8,
    contactNumber: '+91 98456 78901',
  },
  {
    studentId: 'ME2026-021',
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@college.edu',
    department: 'Mechanical Engineering',
    semester: 4,
    contactNumber: '+91 98567 89012',
  },
  {
    studentId: 'CE2026-011',
    name: 'Aditya Nair',
    email: 'aditya.nair@college.edu',
    department: 'Civil Engineering',
    semester: 3,
    contactNumber: '+91 98678 90123',
  },
  {
    studentId: 'EE2026-033',
    name: 'Neha Gupta',
    email: 'neha.gupta@college.edu',
    department: 'Electrical & Electronics',
    semester: 5,
    contactNumber: '+91 98789 01234',
  },
  {
    studentId: 'BA2026-005',
    name: 'Karan Mehra',
    email: 'karan.mehra@college.edu',
    department: 'Business Administration',
    semester: 1,
    contactNumber: '+91 98890 12345',
  },
  {
    studentId: 'CS2026-088',
    name: 'Diya Sen',
    email: 'diya.sen@college.edu',
    department: 'Computer Science & Engineering',
    semester: 2,
    contactNumber: '+91 98901 23456',
  },
];

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI is not defined in backend/.env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('Connected!');

    console.log('Clearing existing students...');
    await Student.deleteMany({});

    console.log('Inserting sample student records...');
    const inserted = await Student.insertMany(sampleStudents);
    console.log(`Successfully seeded ${inserted.length} students into the database!`);

    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
