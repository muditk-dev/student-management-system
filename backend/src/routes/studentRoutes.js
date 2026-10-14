const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboardStats,
} = require('../controllers/studentController');

const checkDbConnection = require('../middleware/checkDbConnection');

// Ensure database connection is live before processing student queries
router.use(checkDbConnection);

// Dashboard statistics
router.get('/stats', getDashboardStats);

// Main student CRUD routes
router.route('/')
  .get(getAllStudents)
  .post(createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
