const { Pool } = require('pg');

const pool = new Pool({
  // Estos son los detalles de tu base de datos
  host: 'localhost',
  port: 5432,
  user: 'danielcalvillo',
  password: '',
  database: 'splitPayments'
});

module.exports = { pool }