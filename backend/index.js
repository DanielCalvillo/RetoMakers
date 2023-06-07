require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const bodyParser = require('body-parser');

const { pool } = require('./conection')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;



// Middleware de autenticación
const { authenticateJWT  } = require('./src/middlewares/auth')

const controllers = require('./src/controllers')

// Configurar CORS
app.use(cors());

// Middleware para analizar el cuerpo de la solicitud en formato JSON

app.post('/webhook', bodyParser.raw({type: 'application/json'}), async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    // Retrieve the session.
    const sessionPaid = await stripe.checkout.sessions.retrieve(event.data.object.id,);
    const debtId = sessionPaid.metadata.debt_id;
    const queryRes = await pool.query(
      'UPDATE debts SET is_paid = true WHERE id = $1 RETURNING *;', 
      [debtId]
    );
    if (queryRes.rows.length > 0) {
      res.status(200).json({ data: queryRes.rows[0] });
    } else {
      res.status(404).json({ message: 'Debt not found' });
    }
    
  }

  res.status(200).end()
})

app.post('/create-checkout-session', express.json(), async (req, res) => {
  const { debt_id } = req.body;

  const result = await pool.query(
    'SELECT * FROM debts WHERE id = $1',
    [debt_id]
  );

  if(!result.rows[0]) {
    return res.status(404).json({ message: 'Debt not found' });
  }

  const debt = result.rows[0];

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: `Deuda de usuario ${debt.debtor_id} y gasto ${debt.expense_id}`,
          },
          unit_amount: parseInt(debt.amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:3000/inicio?success=true`,
    cancel_url: `http://localhost:3000/inicio?canceled=true`,
    metadata: {
      debt_id: debt.id
    }
    // consent_collection: {
    //   terms_of_service: 'required'
    // }
  })

  res.status(200).json({ session_url: session.url });
})

// users
app.post('/users', express.json(), controllers.users.create);
app.post('/users/login', express.json(), controllers.users.login);
app.get('/users/me', express.json(), authenticateJWT, controllers.users.getUser);
app.put('/users/me', express.json(), authenticateJWT, controllers.users.editUser);
app.post('/users/recover_password', express.json(), controllers.users.recoverPassword);

// groups
app.post('/groups', express.json(), authenticateJWT, controllers.groups.create);
app.get('/groups', express.json(), authenticateJWT, controllers.groups.getAll);
app.get('/groups/:id', express.json(), authenticateJWT, controllers.groups.getById);
app.put('/groups/:id', express.json(), authenticateJWT, controllers.groups.update);
app.delete('/groups/:id', express.json(), authenticateJWT, controllers.groups.delete);

// expenses
app.post('/expenses', express.json(), authenticateJWT, controllers.expenses.create);
app.get('/expenses', express.json(), authenticateJWT, controllers.expenses.getAll);
app.get('/expenses/:id', express.json(), authenticateJWT, controllers.expenses.getById);
app.get('/group/:id/expenses', express.json(), authenticateJWT, controllers.expenses.getByGroupId);
app.put('/expenses/:id', express.json(), authenticateJWT, controllers.expenses.update);
app.delete('/expenses/:id', express.json(), authenticateJWT, controllers.expenses.delete);

// debts

app.post('/debts', express.json(), authenticateJWT, controllers.debts.create);
app.get('/expenses/:id/debts', express.json(), authenticateJWT, controllers.debts.getAll);
app.get('/users/debts', express.json(), authenticateJWT, controllers.debts.getByUserId)
app.get('/debts/:id', express.json(), authenticateJWT, controllers.debts.getById);
app.patch('/debts/:id', express.json(), authenticateJWT, controllers.debts.update);
app.delete('/debts/:id', express.json(), authenticateJWT, controllers.debts.delete);


// Group members
app.post('/groups/:groupId/members', express.json(), authenticateJWT, controllers.group_members.create);
app.get('/groups/:groupId/members', express.json(), authenticateJWT, controllers.group_members.getAll);
// app.get('/groups/:groupId/members/:memberId', authenticateJWT, controllers.group_members.getById);
app.delete('/groups/:groupId/members', express.json(), authenticateJWT, controllers.group_members.delete);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
});