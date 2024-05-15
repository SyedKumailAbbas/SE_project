// routes/class.js

const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const User = require('../models/User')
const generateRandomCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

// Function to create a new class with a unique class code
const create = async (req, res) => {
  try {
    const { title, description, teacher } = req.body;
    let classcode = generateRandomCode(8); // Generate an 8-character code

    // Check if the generated class code already exists
    let existingClass = await Class.findOne({ classcode });
    while (existingClass) {
      // Regenerate the class code until it's unique
      classcode = generateRandomCode(8);
      existingClass = await Class.findOne({ classcode });
    }

    const newClass = await Class.create({ title, description, teacher, classcode });
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Function to enroll a student in a class using class code
const join = async (req, res) => {
  try {
    const { classcode, username } = req.body;

    const cls = await Class.findOne({ classcode });
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    cls.students.push(username);
    await cls.save();

    res.json({ message: `Student enrolled successfully ${username}` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const getClassesByTeacherName = async (req, res) => {
  try {
    const teacherName = req.params.teacherName;
    const classes = await Class.find({ teacher: teacherName });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getClassesByStudentUsername = async (req, res) => {
  try {
    const { username } = req.params;

    // Get all classes where the student's ID appears in the students array
    const classes = await Class.find({ students: username });
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getClassById = async (req, res) => {
  try {
    const classId = req.params.classId;
    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(cls); // Only send cls as JSON, not classId separately
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getstds = async (req, res) => {

  try {
    const classid = req.params.classid
    const getclass = await Class.findById(classid)
    res.status(200).json(getclass.students)

  }
  catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const removestd = async (req, res) => {
try {
  const {classid,stdname}=req.params
        // Remove the specified student from the students array
        const updatedClass = await Class.findByIdAndUpdate(
          classid,
          { $pull: { students: stdname } },
          { new: true }
      );

      // Return the updated class or a success message
      res.json(updatedClass.students);
  } catch (error) {
      console.error('Error removing student:', error);
      res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = { removestd,create, join, getClassesByTeacherName, getstds, getClassesByStudentUsername, getClassById };
