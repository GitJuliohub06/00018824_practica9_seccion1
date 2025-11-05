import { Router } from 'express'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = Router()

router.get('/users', verifyToken, getUsers)
router.get('/users/:id', verifyToken, getUserById)
router.post('/users', verifyToken, createUser)
router.put('/users/:id', verifyToken, updateUser)
router.delete('/users/:id', verifyToken, deleteUser)

export default router