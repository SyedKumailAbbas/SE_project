// routes/class.js

const express = require("express");
const router = express.Router();

const { create, join, getClassesByTeacherName,getClassesByStudentUsername,getClassById } = require("../controllers/class");
const authMiddleware = require('../middleware/auth');

router.route("/create").post(create);
router.route("/join").post(join);
router.route("/teacher/:teacherName").get(getClassesByTeacherName);
router.route('/classes/:username').get(getClassesByStudentUsername);
router.route('/classes/classid/:classId').get(getClassById);
module.exports = router;
