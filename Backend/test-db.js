import { pool } from './database.js'

async function test() {
  const res = await pool.query('SELECT * FROM users')
  console.log(res.rows)
}

test()
