// routes/class.js

const express = require("express");
const router = express.Router();

const {removestd, getstds,create, join, getClassesByTeacherName,getClassesByStudentUsername,getClassById } = require("../controllers/class");

router.route("/create").post(create);
router.route("/join").post(join);
router.route("/teacher/:teacherName").get(getClassesByTeacherName);
router.route('/classes/:username').get(getClassesByStudentUsername);
router.route('/classes/classid/:classId').get(getClassById);
router.route('/students/:classid').get(getstds)
router.route('/delstudent/:classid/:stdname').delete(removestd)
module.exports = router;
