const { pool } = require('../../conection')


async function createDebt(req, res) {
  const { debtor_id, creditor_id, amount } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO debts (debtor_id, creditor_id, amount) VALUES ($1, $2, $3) RETURNING *',
      [debtor_id, creditor_id, amount]
    );

    res.send(result.rows[0]);
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