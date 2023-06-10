const { pool } = require('../../conection')
const jwt = require('jsonwebtoken');

// TODO: Modularizar token generation
const secretKey = process.env.SPLIT_SECRET_KEY;

// TODO: Modularizar stripe API calls
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function getAccountLinkController(req, res) {
  const userId = req.user.userId;
  const { type } = req.params;

  let user = null;

  try {
    const pgRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    user = pgRes.rows[0]
  } catch(err) {
    return res.status(404).json({ message: err.message });
  }

  if (!user) {
    return res.status(404).json({ message: 'user not found' });
  }
  
  const accountLink = await stripe.accountLinks.create({
    account: user.stripe_id,
    refresh_url: 'https://example.com/reauth',
    return_url: 'https://example.com/return',
    type: type ? type : 'account_onboarding',
  });

  return res.status(200).json({ link: accountLink });
}

async function createUserController(req, res) {
  const { first_name, last_name, email, password } = req.body;

  let user;

  try {
    let dbRes = await pool.query(
      'INSERT INTO users (name, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [`${first_name} ${last_name}`, email, password, first_name, last_name]
    );

    user = dbRes.rows[0];

    const token = jwt.sign({ userId: user.id }, secretKey);

    // Create Stripe account after user creation
    const account = await stripe.accounts.create({
      type: 'custom',
      country: 'MX',
      email: email,
      // This is necesary if individual is not null
      business_type: 'individual',
      individual: {
        first_name: first_name,
        last_name: last_name,
        email: email,

      },
      capabilities: {
        card_payments: {requested: true},
        transfers: {requested: true},
        oxxo_payments: {requested: true}
      },
      metadata: {
        split_id: user.id // Assuming that you want to use the user's id in your platform as the split_id
      },
      settings: {
        payouts: {
          schedule: {
            interval: 'manual',
          },
        },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://example.com/reauth',
      return_url: 'https://example.com/return',
      type: 'account_onboarding',
    });

    // Add Stripe account id to the token data
    token.stripeAccountId = account.id;

    dbRes = await pool.query(
      "UPDATE users SET stripe_id = $1 WHERE id = $2 RETURNING *;",
      [account.id, user.id]
    );

    user = dbRes.rows[0]

    return res.status(200).json({ user, data: token, account, account_link: accountLink }); 
  } catch (err) {
    console.error(err);
    return res.status(404).json({ message: 'Error creating user', error: err.message });
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

async function recoverPassword(req, res) {
  const { email, newPassword } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length > 0) {
      // Actualizar la contraseña del usuario
      await pool.query('UPDATE users SET password = $1 WHERE email = $2', [newPassword, email]);

      res.status(200).json({ message: 'Password recovery successful' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error recovering password', error: err });
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
  recoverPassword: recoverPassword,
  getAccountLink: getAccountLinkController
};