require('dotenv').config()
const { Client } = require('pg');

const client = new Client({
  // Estos son los detalles de tu base de datos
  host: process.env.SUPABASE_DB_HOST,
  port:  process.env.SUPABASE_DB_PORT,
  user: process.env.SUPABASE_DB_USER,
  password: process.env.SUPABASE_DB_PASSWORD,
  database: process.env.SUPABASE_DB_NAME
});

const createTables = async () => {

  await client.connect();
  const res = await client.query('SELECT $1::text as message', ['Database up & running!'])
  console.log(res.rows[0].message) // Hello world!

  await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL
    );

    CREATE TABLE groups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT
    );

    CREATE TABLE group_members (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      group_id INTEGER REFERENCES groups(id)
    );

    CREATE TABLE expenses (
      id SERIAL PRIMARY KEY,
      group_id INTEGER REFERENCES groups(id),
      user_id INTEGER REFERENCES users(id),
      amount DECIMAL(10, 2) NOT NULL,
      description TEXT,
      date TIMESTAMP NOT NULL
    );

    CREATE TABLE debts (
      id SERIAL PRIMARY KEY,
      debtor_id INTEGER REFERENCES users(id),
      creditor_id INTEGER REFERENCES users(id),
      amount DECIMAL(10, 2) NOT NULL,
      expense_id INTEGER REFERENCES expenses(id)
    );
  `);

    await client.end()
};

createTables();
