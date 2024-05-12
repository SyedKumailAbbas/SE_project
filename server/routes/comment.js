const express=require("express")
const { addComment, getPostComments,delcomment } = require("../controllers/comment")
const router=express.Router()

router.route("/:postid/:username").post(addComment)
router.route("/:postid").get(getPostComments)
router.route("/del/:commentId").delete(delcomment)
module.exports=router