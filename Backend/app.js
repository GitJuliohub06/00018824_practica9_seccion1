import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import userRoutes from "./routes/user.routes.js"
import verifyToken from "./middlewares/verifyToken.js"
import { pool } from "./database.js"

const app = express()
const PORT = 5000
const JWT_SECRET = "your_jwt_secret" // En producción, usar .env

app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("Bienvenido a la API de usuarios 🧪")
})

app.post("/signin", async (req, res) => {
    const { email, password } = req.body

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1 LIMIT 1",
            [email]
        )

        const isPasswordValid = true
        const user = { id: 1, email }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.status(200).json({ token })
    } catch (err) {
        res.status(500).json({ message: "Error en el servidor", error: err.message })
    }
})

app.get("/protected", verifyToken, (req, res) => {
    res.json({
        message: "¡Has accedido a la ruta protegida!",
        user: req.user,
    })
})

app.use("/", verifyToken, userRoutes)

app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
)

