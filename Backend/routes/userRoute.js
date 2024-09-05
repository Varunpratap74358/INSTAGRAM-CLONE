import express from 'express'
import isAuthenticated from '../middleware/isAuthonticated.js'
import {
  editProfile,
  followAndUnfollow,
  getProfile,
  getSuggestedUser,
  login,
  logout,
  register,
} from '../controllers/userControler.js'
import upload from '../middleware/multer.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', isAuthenticated, logout)
router.get('/:id/profile', isAuthenticated, getProfile)
router.post('/profile/edit',isAuthenticated,upload.single('profilePicture'),editProfile)
router.get('/suggested', isAuthenticated, getSuggestedUser)
router.get('/followorunfollow/:id', isAuthenticated, followAndUnfollow)

export default router
