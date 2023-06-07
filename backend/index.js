require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');


// Middleware de autenticación
const { authenticateJWT  } = require('./src/middlewares/auth')

const controllers = require('./src/controllers')

// Configurar CORS
app.use(cors());

// Middleware para analizar el cuerpo de la solicitud en formato JSON
app.use(express.json());

// users
app.post('/users', controllers.users.create);
app.post('/users/login', controllers.users.login);
app.get('/users/me', authenticateJWT, controllers.users.getUser);
app.put('/users/me', authenticateJWT, controllers.users.editUser);
app.post('/users/recover_password', controllers.users.recoverPassword);

// groups
app.post('/groups', authenticateJWT, controllers.groups.create);
app.get('/groups', authenticateJWT, controllers.groups.getAll);
app.get('/groups/:id', authenticateJWT, controllers.groups.getById);
app.put('/groups/:id', authenticateJWT, controllers.groups.update);
app.delete('/groups/:id', authenticateJWT, controllers.groups.delete);

// expenses
app.post('/expenses', authenticateJWT, controllers.expenses.create);
app.get('/expenses', authenticateJWT, controllers.expenses.getAll);
app.get('/expenses/:id', authenticateJWT, controllers.expenses.getById);
app.get('/expenses/group/:id', authenticateJWT, controllers.expenses.getByGroupId);
app.put('/expenses/:id', authenticateJWT, controllers.expenses.update);
app.delete('/expenses/:id', authenticateJWT, controllers.expenses.delete);

// debts

app.post('/debts', authenticateJWT, controllers.debts.create);
app.get('/debts/expense/:id', authenticateJWT, controllers.debts.getAll);
app.get('/debts/:id', authenticateJWT, controllers.debts.getById);
app.put('/debts/:id', authenticateJWT, controllers.debts.update);
app.delete('/debts/:id', authenticateJWT, controllers.debts.delete);


// Group members
app.post('/groups/:groupId/members', authenticateJWT, controllers.group_members.create);
app.get('/groups/:groupId/members', authenticateJWT, controllers.group_members.getAll);
// app.get('/groups/:groupId/members/:memberId', authenticateJWT, controllers.group_members.getById);
app.delete('/groups/:groupId/members', authenticateJWT, controllers.group_members.delete);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
});