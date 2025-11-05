import bcrypt from 'bcrypt'
import { pool } from '../database.js'

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email FROM users')
    res.json(result.rows)
  } catch (err) {
    console.error("Error al obtener usuarios:", err)
    res.status(500).json({ 
      message: "Error al obtener usuarios", 
      error: err.message 
    })
  }
}

export const getUserById = async (req, res) => {
  const { id } = req.params
  
  try {
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1', 
      [id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: "Usuario no encontrado" 
      })
    }
    
    res.json(result.rows[0])
  } catch (err) {
    console.error("Error al obtener usuario:", err)
    res.status(500).json({ 
      message: "Error al obtener usuario", 
      error: err.message 
    })
  }
}

export const createUser = async (req, res) => {
  const { name, email, password } = req.body
  
  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: "Nombre, email y password son requeridos" 
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
    
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error("Error al crear usuario:", err)
    res.status(500).json({ 
      message: "Error al crear usuario", 
      error: err.message 
    })
  }
}

export const updateUser = async (req, res) => {
  const { id } = req.params
  const { name, email, password } = req.body
  
  try {
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    )
    
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ 
        message: "Usuario no encontrado" 
      })
    }
    
    if (password) {
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      
      const result = await pool.query(
        'UPDATE users SET name=$1, email=$2, password=$3 WHERE id=$4 RETURNING id, name, email',
        [name, email, hashedPassword, id]
      )
      
      return res.json(result.rows[0])
    }
    
    const result = await pool.query(
      'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email',
      [name, email, id]
    )
    
    res.json(result.rows[0])
  } catch (err) {
    console.error("Error al actualizar usuario:", err)
    res.status(500).json({ 
      message: "Error al actualizar usuario", 
      error: err.message 
    })
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params
  
  try {
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    )
    
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ 
        message: "Usuario no encontrado" 
      })
    }
    
    await pool.query('DELETE FROM users WHERE id = $1', [id])
    res.json({ 
      message: 'Usuario eliminado correctamente',
      id: id
    })
  } catch (err) {
    console.error("Error al eliminar usuario:", err)
    res.status(500).json({ 
      message: "Error al eliminar usuario", 
      error: err.message 
    })
  }
}