// routes/user.routes.js
import { Router } from 'express'
import {
  displayHome,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = Router()

router.get('/', displayHome)
router.get('/users', verifyToken, getUsers)
router.get('/users/:id', verifyToken, getUserById)
router.post('/users', verifyToken, createUser)
router.put('/users/:id', verifyToken, updateUser)
router.delete('/users/:id', verifyToken, deleteUser)

export default router
