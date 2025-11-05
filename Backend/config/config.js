export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiresIn: '1h',
  bcryptSaltRounds: 10,
  database: {
    user: process.env.DB_USER || 'neondb_owner',
    host: process.env.DB_HOST || 'ep-curly-sound-ahcrxe5b-pooler.c-3.us-east-1.aws.neon.tech',
    database: process.env.DB_NAME || 'neondb',
    password: process.env.DB_PASSWORD || 'npg_WUmQdXwNZ2f6',
    ssl: { rejectUnauthorized: false }
  }
}