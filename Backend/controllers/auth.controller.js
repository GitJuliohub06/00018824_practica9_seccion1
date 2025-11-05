import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { pool } from '../database.js'

const JWT_SECRET = "your_jwt_secret" 

export const signup = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ 
            message: "Nombre, email y password son requeridos" 
        })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            message: "Email inválido" 
        })
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            message: "La contraseña debe tener al menos 6 caracteres" 
        })
    }

    try {
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        )

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ 
                message: "El email ya está registrado" 
            })
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        )

        const newUser = result.rows[0]

        const token = jwt.sign(
            {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.status(201).json({ 
            message: "Usuario registrado exitosamente",
            token,
            user: newUser
        })
    } catch (err) {
        console.error("Error en signup:", err)
        res.status(500).json({ 
            message: "Error al registrar usuario", 
            error: err.message 
        })
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ 
            message: "Email y password son requeridos" 
        })
    }

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1 LIMIT 1",
            [email]
        )

        if (result.rows.length === 0) {
            return res.status(401).json({ 
                message: "Credenciales inválidas" 
            })
        }

        const user = result.rows[0]

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: "Credenciales inválidas" 
            })
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.status(200).json({ 
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        console.error("Error en signin:", err)
        res.status(500).json({ 
            message: "Error en el servidor", 
            error: err.message 
        })
    }
}

export const getProtectedData = (req, res) => {
    res.json({
        message: "¡Has accedido a la ruta protegida!",
        user: req.user,
    })
}