const { Pool } = require('pg');

const pool = new Pool({
  // Estos son los detalles de tu base de datos
  host: process.env.SUPABASE_DB_HOST,
  port:  process.env.SUPABASE_DB_PORT,
  user: process.env.SUPABASE_DB_USER,
  password: process.env.SUPABASE_DB_PASSWORD,
  database: process.env.SUPABASE_DB_NAME
});

module.exports = { pool }