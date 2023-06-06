const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');


// Middleware de autenticación
const { authenticateJWT  } = require('./src/middlewares/auth')

const controllers = require('./src/controllers')

// Configurar CORS
app.use(cors());

// Middleware para analizar el cuerpo de la solicitud en formato JSON
app.use(express.json());


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

// users
app.post('/users', controllers.users.create);
app.post('/users/login', controllers.users.login);
app.get('/users/me', authenticateJWT, controllers.users.getUser);
app.put('/users/me', authenticateJWT, controllers.users.editUser);

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
app.put('/expenses/:id', authenticateJWT, controllers.expenses.update);
app.delete('/expenses/:id', authenticateJWT, controllers.expenses.delete);

// debts

app.post('/debts', authenticateJWT, controllers.debts.create);
app.get('/debts', authenticateJWT, controllers.debts.getAll);
app.get('/debts/:id', authenticateJWT, controllers.debts.getById);
app.put('/debts/:id', authenticateJWT, controllers.debts.update);
app.delete('/debts/:id', authenticateJWT, controllers.debts.delete);


// Group members
app.post('/groups/:groupId/members', authenticateJWT, controllers.group_members.create);
app.get('/groups/:groupId/members', authenticateJWT, controllers.group_members.getAll);
// app.get('/groups/:groupId/members/:memberId', authenticateJWT, controllers.group_members.getById);
app.delete('/groups/:groupId/members', authenticateJWT, controllers.group_members.delete);