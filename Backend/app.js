import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"

const app = express()
const PORT = 5000

// Middlewares globales
app.use(cors())
app.use(bodyParser.json())

// Ruta principal
app.get("/", (req, res) => {
    res.send("Bienvenido a la API de usuarios 🧪")
})

// Rutas de autenticación (sin protección)
app.use("/", authRoutes)

// Rutas de usuarios (protegidas)
app.use("/", userRoutes)

// Iniciar servidor
app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
)

export default app