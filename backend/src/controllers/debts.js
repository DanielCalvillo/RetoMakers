const { pool } = require('../../conection')

function calculateTotalDebt(debts) {
  let total = 0;
  debts.forEach((debt) => {
    total += parseFloat(debt.amount);
  });
  return total.toFixed(2);
}


async function createDebt(req, res) {
  const { debtor_email, creditor_email, amount, expense_id } = req.body;
  

  try {
    const creditor = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [creditor_email]
    );

    const debtor = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [debtor_email]
    );

    const expense = await pool.query(
      'SELECT * FROM expenses WHERE id = $1',
      [expense_id]
    );

    const debts_of_expense = await pool.query(
      'SELECT * FROM debts WHERE expense_id = $1',
      [expense_id]
    );
    const totalDebt = calculateTotalDebt(debts_of_expense.rows);

    if (parseInt(totalDebt) + amount > parseInt(expense.rows[0].amount)) {
      res.status(401).json({ message: 'The total debt is grater than the amount of the expense' });
    } else {
      if (creditor.rows.length > 0 && debtor.rows.length && expense.rows.length > 0) {
        const result = await pool.query(
          'INSERT INTO debts (debtor_id, creditor_id, amount, expense_id) VALUES ($1, $2, $3, $4) RETURNING *',
          [debtor.rows[0].id, creditor.rows[0].id, amount, expense_id]
        );
        res.status(201).json({ data: result.rows[0] });
      } else {
        res.status(401).json({ message: 'Some of the values you submit was not found' });
  
      }

    }

  } catch (err) {
    res.status(404).json({ message: 'Error creating debt', error: err });
  }
}

async function getDebtsByExpense(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM debts WHERE expense_id = $1',
      [id]
    );

    res.send(result.rows);
  } catch (err) {
    res.status(404).json({ message: 'Error retrieving debts', error: err });
  }
}

async function getDebtsByUserId(req, res) {
  const id = req.user.userId;
  const all_debts = []
  try {
    const result = await pool.query(
      'SELECT * FROM debts WHERE debtor_id = $1 AND is_paid=false',
      [id]
    );

    for (const debt of result.rows) {
      const user = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [debt.creditor_id]
      );

      if (user) {
        all_debts.push({ ...debt, creditor_mail: user.rows[0].email});
      }
    }

    res.send(all_debts);
  } catch (err) {
    res.status(404).json({ message: 'Error retrieving debts', error: err });
  }
}

async function getDebtById(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM debts WHERE id = $1',
      [id]
    );
    const user = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [result.rows[0].creditor_id]
    );

    if (result.rows.length > 0) {
      res.send({ ...result.rows[0], creditor_email: user.rows[0].email});
    } else {
      res.status(404).json({ message: 'Debt not found' });
    }
  } catch (err) {
    res.status(404).json({ message: 'Error retrieving debt', error: err });
  }
}

async function updateDebt(req, res) {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const result = await pool.query(
      'UPDATE debts SET amount = $1 WHERE id = $2 RETURNING *',
      [amount, id]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ data: result.rows[0] });
    } else {
      res.status(404).json({ message: 'Debt not found' });
    }

  } catch(err) {
    res.status(404).json({ message: 'Debt not found', error: err });

  }
}

async function deleteDebt(req, res) {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM debts WHERE id = $1', [id]);
    res.send({ message: 'Debt deleted successfully' });
  } catch (err) {
    res.status(404).json({ message: 'Error deleting debt', error: err });
  }
}

module.exports = {
  create: createDebt,
  getAll: getDebtsByExpense,
  getById: getDebtById,
  update: updateDebt,
  delete: deleteDebt,
  getByUserId: getDebtsByUserId
};