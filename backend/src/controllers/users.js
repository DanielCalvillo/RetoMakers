const { pool } = require('../../conection')
const jwt = require('jsonwebtoken');

// TODO: Cambiar a variable de entorno
const secretKey = 'tu_clave_secreta';


async function createUserController(req, res) {
  const { name, email, password } = req.body;

  let user;

  try {
    user = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    if (user) {
      const token = jwt.sign({ userId: user.rows[0].id }, secretKey);
      return res.status(200).json({ data: token }); 
    }
  } catch (err) {
    return res.status(404).json({ message: 'Error creating user', error: err });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  let user;

  try {
    user = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (user.rows.length > 0) {
      // Genera el token JWT
      const token = jwt.sign({ userId: user.rows[0].id }, secretKey);
      res.status(200).json({ data: { token } });

    } else {
      res.status(401).json({ message: 'Invalid Credentials' });
    }

  } catch (err) {
    return res.status(401).json({ message: 'Invalid Credentials', error: err });
  }
}

async function editUser(req, res) {
  const userId = req.user.userId;

  const { name, email, password } = req.body;

  const updateFields = {};
  const queryValues = [];
  let query = 'UPDATE users SET';

  if (name) {
    updateFields.name = name;
    queryValues.push(name);
    query += ' name = $' + queryValues.length + ',';
  }

  if (email) {
    updateFields.email = email;
    queryValues.push(email);
    query += ' email = $' + queryValues.length + ',';
  }

  if (password) {
    updateFields.password = password;
    queryValues.push(password);
    query += ' password = $' + queryValues.length + ',';
  }

  // Eliminar la coma final en la cláusula SET
  query = query.slice(0, -1);

  query += ' WHERE id = $' + (queryValues.length + 1) + ' RETURNING *';
  queryValues.push(userId);

  let user;

  try {
    user = await pool.query(query, queryValues);

    res.status(200).json({ data: user.rows[0]});

  } catch (err) {
    return res.status(404).json({ message: 'Error Updating User', error: err });
  }
}

async function getUserData(req, res) {
  const userId = req.user.userId;

  let user;

  try {
    user = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    if (user) {
      return res.status(200).json({ data: user.rows[0] }); 
    }
  } catch (err) {
    return res.status(404).json({ message: 'Error getting data', error: err });
  }
}

module.exports = {
  create: createUserController,
  login: loginUser,
  editUser: editUser,
  getUser: getUserData,
};