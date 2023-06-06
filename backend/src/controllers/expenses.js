const { pool } = require('../../conection')

async function createExpense(req, res) {
  const userId = req.user.userId;

  const { group_id, amount, description, date, email } = req.body;

  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length > 0) {
      const result =  await pool.query(
        'INSERT INTO expenses (group_id, user_id, amount, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [group_id, user.rows[0].id, amount, description, date]
      );
      const expense = result.rows[0]
    
      res.status(200).json({ data: expense });
    } else {
      res.status(401).json({ message: 'User not found' });
    }

    

  } catch(err) {
    res.status(400).json({ message: "Error creating expense", error: err });
  }

}

async function getExpenses(req, res) {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'SELECT e.* FROM expenses e JOIN group_members gm ON e.group_id = gm.group_id WHERE gm.user_id = $1',
      [userId]
    );
    res.status(200).json({ data: result.rows });

  } catch (err) {
    res.status(400).json({ message: "Error getting expenses", error: err });
  }

}

async function getExpenseById(req, res) {
  const { id } = req.params;

  try {

    const result = await pool.query(
      'SELECT * FROM expenses WHERE id = $1',
      [id]
    );
  
    if (result.rows.length > 0) {
      res.status(200).json({ data: result.rows[0] });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }

  } catch(err) {
    res.status(400).json({ message: 'Expense not found', error: err });
  }
}

async function updateExpense(req, res) {
  const { id } = req.params;
  const { group_id, amount, description, date } = req.body;

  const updateFields = {};
  const queryValues = [];
  let query = 'UPDATE expenses SET';

  if (group_id) {
    updateFields.group_id = group_id;
    queryValues.push(group_id);
    query += ' group_id = $' + queryValues.length + ',';
  }

  if (amount) {
    updateFields.amount = amount;
    queryValues.push(amount);
    query += ' amount = $' + queryValues.length + ',';
  }

  if (description) {
    updateFields.description = description;
    queryValues.push(description);
    query += ' description = $' + queryValues.length + ',';
  }

  if (date) {
    updateFields.date = date;
    queryValues.push(date);
    query += ' date = $' + queryValues.length + ',';
  }

  // Eliminar la coma final en la cláusula SET
  query = query.slice(0, -1);

  query += ' WHERE id = $' + (queryValues.length + 1) + ' RETURNING *';
  queryValues.push(id);

  try {
    const result = await pool.query(query, queryValues);

    if (result.rows.length > 0) {
      res.send(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (err) {
    res.status(404).json({ message: 'Expense not found', error: err });
  }
}

async function deleteExpense(req, res) {
  const { id } = req.params;

  try {
    await pool.query(
      'DELETE FROM expenses WHERE id = $1',
      [id]
    );
    res.status(200).json({ message: 'Expense deleted successfully' });

  } catch(err) {
    res.status(404).json({ message: 'Error deleting Expense', error: err });
  }


}

async function getExpensesByGroupId(req, res) {
  const { id } = req.params;
  let expenses = []
  try {
    const result = await pool.query(
      'SELECT * FROM expenses WHERE group_id = $1',
      [id]
    );

    for (const expense of result.rows) {
      const user = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [expense.user_id]
      );

      if (user) {
        expenses.push({...expense, expense_owner_email: user.rows[0].email});
      }
    }

    res.status(200).json({ data: expenses });
  } catch (err) {
    res.status(400).json({ message: 'Error getting expenses by group ID', error: err });
  }
}

module.exports = {
  create: createExpense,
  getAll: getExpenses,
  getById: getExpenseById,
  update: updateExpense,
  delete: deleteExpense,
  getByGroupId: getExpensesByGroupId,

};