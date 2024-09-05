import express from 'express'
import isAuthenticated from '../middleware/isAuthonticated.js'
import { getMessage, sendMessage } from '../controllers/messageControler.js'
const router = express.Router()

router.post('/send/:id', isAuthenticated, sendMessage)
router.get('/all/:id', isAuthenticated, getMessage)

export default router
