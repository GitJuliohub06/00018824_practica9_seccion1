import { Router } from 'express'
import { signup, signin, getProtectedData } from '../controllers/auth.controller.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = Router()

router.post('/signup', signup)

router.post('/signin', signin)

router.get('/protected', verifyToken, getProtectedData)

export default router