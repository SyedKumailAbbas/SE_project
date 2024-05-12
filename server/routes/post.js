const express = require("express")
const router = express.Router()


const {createpost,getallpost,getpostbyid,getpostbytype,submitassignment,getsubmissions}=require("../controllers/post")

router.route('/create').post(createpost)
router.route('/getallpost/:classid').get(getallpost)
router.route('/getpostbyid/:postid').get(getpostbyid)
router.route('/getpostbytype/:classid/:type').get(getpostbytype)
router.route('/submit/:postid/:username').post(submitassignment)
router.route('/getsubmissions/:postid').get(getsubmissions)

module.exports=router