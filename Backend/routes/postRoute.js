import express from "express";
import isAuthenticated from "../middleware/isAuthonticated.js";
import { addComment, addNewPost, bookmarkPost, deletePost, dislike, getAllPost, getCommentsOfPost, getPostOfUser, likePost } from "../controllers/postControler.js";
import upload from "../middleware/multer.js";
const router = express.Router()

router.post("/addpost",isAuthenticated,upload.single('image'),addNewPost)
router.get("/all",isAuthenticated,getAllPost)
router.get("/userpost/all",isAuthenticated,getPostOfUser)
router.get("/:id/like",isAuthenticated,likePost)
router.get("/:id/dislike",isAuthenticated,dislike)
router.post("/:id/comment",isAuthenticated,addComment)
router.get("/:id/comment/all",isAuthenticated,getCommentsOfPost)
router.delete("/delete/:id",isAuthenticated,deletePost)
router.get("/:id/bookmark",isAuthenticated,bookmarkPost)

export default router