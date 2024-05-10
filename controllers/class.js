// routes/class.js

const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const User = require('../models/User')

// Function to generate a random alphanumeric code
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
    let classCode = generateRandomCode(8); // Generate an 8-character code

    // Check if the generated class code already exists
    let existingClass = await Class.findOne({ classCode });
    while (existingClass) {
      // Regenerate the class code until it's unique
      classCode = generateRandomCode(8);
      existingClass = await Class.findOne({ classCode });
    }

    const newClass = await Class.create({ title, description, teacher, classCode });
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Function to enroll a student in a class using class code
const join = async (req, res) => {
  try {
    const { classCode, username } = req.body;

    const cls = await Class.findOne({ classCode });
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
  
module.exports = { create, join ,getClassesByTeacherName,getClassesByStudentUsername,getClassById};
