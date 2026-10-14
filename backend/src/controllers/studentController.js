const mongoose = require('mongoose');
const Student = require('../models/Student');

// Helper to find student either by MongoDB _id or by studentId string
const findStudentByIdOrCode = async (identifier) => {
  if (mongoose.isValidObjectId(identifier)) {
    const student = await Student.findById(identifier);
    if (student) return student;
  }
  return await Student.findOne({ studentId: identifier.toUpperCase() });
};

// @desc    Get all students (with search, filter, sorting, and pagination)
// @route   GET /api/students
// @access  Public
const getAllStudents = async (req, res, next) => {
  try {
    const { search, q, department, semester, sortBy = 'createdAt', sortOrder = 'desc', page, limit } = req.query;

    const query = {};

    // Search by student ID, name, or email
    const searchTerm = search || q;
    if (searchTerm && searchTerm.trim()) {
      const regex = new RegExp(searchTerm.trim(), 'i');
      query.$or = [
        { studentId: regex },
        { name: regex },
        { email: regex },
      ];
    }

    // Filter by department
    if (department && department !== 'All') {
      query.department = department;
    }

    // Filter by semester
    if (semester && semester !== 'All') {
      const parsedSemester = parseInt(semester, 10);
      if (!isNaN(parsedSemester)) {
        query.semester = parsedSemester;
      }
    }

    // Sorting
    const sortField = sortBy || 'createdAt';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortDirection };

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100; // default to 100 max per page
    const skip = (pageNum - 1) * limitNum;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student by MongoDB _id or studentId
// @route   GET /api/students/:id
// @access  Public
const getStudentById = async (req, res, next) => {
  try {
    const student = await findStudentByIdOrCode(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with identifier: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / register new student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res, next) => {
  try {
    let { studentId, name, email, department, semester, contactNumber } = req.body;

    if (!studentId || !name || !email || !department || semester === undefined || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: studentId, name, email, department, semester, contactNumber',
      });
    }

    studentId = studentId.toString().trim().toUpperCase();

    // Check duplicate studentId explicitly for immediate, beginner-friendly feedback
    const existing = await Student.findOne({ studentId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A student with Student ID "${studentId}" already exists. Please use a unique ID.`,
      });
    }

    const student = await Student.create({
      studentId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      department,
      semester: Number(semester),
      contactNumber: contactNumber.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = async (req, res, next) => {
  try {
    const student = await findStudentByIdOrCode(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with identifier: ${req.params.id}`,
      });
    }

    const { studentId, name, email, department, semester, contactNumber } = req.body;

    // Check if new studentId is being used by another student
    if (studentId && studentId.toUpperCase() !== student.studentId) {
      const conflict = await Student.findOne({ studentId: studentId.toUpperCase(), _id: { $ne: student._id } });
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: `Cannot update: Student ID "${studentId.toUpperCase()}" is already assigned to another student.`,
        });
      }
      student.studentId = studentId.toUpperCase();
    }

    if (name) student.name = name.trim();
    if (email) student.email = email.trim().toLowerCase();
    if (department) student.department = department;
    if (semester !== undefined) student.semester = Number(semester);
    if (contactNumber) student.contactNumber = contactNumber.trim();

    const updatedStudent = await student.save();

    res.status(200).json({
      success: true,
      message: 'Student details updated successfully',
      data: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student record
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res, next) => {
  try {
    const student = await findStudentByIdOrCode(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with identifier: ${req.params.id}`,
      });
    }

    await Student.findByIdAndDelete(student._id);

    res.status(200).json({
      success: true,
      message: `Student ${student.name} (${student.studentId}) was deleted successfully.`,
      data: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & department statistics
// @route   GET /api/students/stats
// @access  Public
const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();

    // Department counts
    const departmentStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Semester counts
    const semesterStats = await Student.aggregate([
      { $group: { _id: '$semester', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Recent 5 students
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('studentId name email department semester createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        departmentCount: departmentStats.length,
        departmentStats: departmentStats.map((d) => ({ department: d._id, count: d.count })),
        semesterStats: semesterStats.map((s) => ({ semester: s._id, count: s.count })),
        recentStudents,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboardStats,
};
