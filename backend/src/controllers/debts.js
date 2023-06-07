const { pool } = require('../../conection')


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

    if (creditor.rows.length > 0 && debtor.rows.length) {
      const result = await pool.query(
        'INSERT INTO debts (debtor_id, creditor_id, amount, expense_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [debtor.rows[0].id, creditor.rows[0].id, amount, expense_id]
      );
      res.status(201).json({ data: result.rows[0] });
    } else {
      res.status(401).json({ message: 'User not found' });

    }
  } catch (err) {
    res.status(404).json({ message: 'Error creating debt', error: err });
  }
}

async function getDebts(req, res) {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM debts WHERE debtor_id = $1 OR creditor_id = $1',
      [userId]
    );

    res.send(result.rows);
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

    if (result.rows.length > 0) {
      res.send(result.rows[0]);
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
  getAll: getDebts,
  getById: getDebtById,
  update: updateDebt,
  delete: deleteDebt,
};