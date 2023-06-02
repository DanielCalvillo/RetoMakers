const { pool } = require('../../conection')

async function createGroup(req, res) {
  const userId = req.user.userId;

  const { name, description } = req.body;

  try {
    const groupResult = await pool.query(
      'INSERT INTO groups (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
  
    const group = groupResult.rows[0];
  
    await pool.query(
      'INSERT INTO group_members (user_id, group_id) VALUES ($1, $2)',
      [userId, group.id]
    );
  
    res.status(200).json({ data: group });

  } catch(err) {
    res.status(400).json({ message: "Error creating group", error: err });
  }

}

async function getAllGroups(req, res) {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'SELECT g.* FROM groups g JOIN group_members gm ON g.id = gm.group_id WHERE gm.user_id = $1',
      [userId]
    );
    res.status(200).json({ data: result.rows });

  } catch (err) {
    res.status(400).json({ message: "Error getting groups", error: err });
  }

}

async function getGroupById(req, res) {
  const { id } = req.params;

  try {

    const result = await pool.query(
      'SELECT * FROM groups WHERE id = $1',
      [id]
    );
  
    if (result.rows.length > 0) {
      res.status(200).json({ data: result.rows[0] });
    } else {
      res.status(404).json({ message: 'Group not found' });
    }

  } catch(err) {
    res.status(400).json({ message: 'Group not found', error: err });
  }
}

async function updateGroup(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;

  const updateFields = {};
  const queryValues = [];
  let query = 'UPDATE groups SET';

  if (name) {
    updateFields.name = name;
    queryValues.push(name);
    query += ' name = $' + queryValues.length + ',';
  }

  if (description) {
    updateFields.description = description;
    queryValues.push(description);
    query += ' description = $' + queryValues.length + ',';
  }

  // Eliminar la coma final en la cláusula SET
  query = query.slice(0, -1);

  query += ' WHERE id = $' + (queryValues.length + 1) + ' RETURNING *';
  queryValues.push(id);

  try {
    const result = await pool.query(query, queryValues);

    if (result.rows.length > 0) {
      res.status(200).json({ data: result.rows[0] });
    } else {
      res.status(404).json({ message: 'Group not found' });
    }

  } catch (err) {
    res.status(404).json({ message: 'Group not found', error: err });
  }
}

async function deleteGroup(req, res) {
  const { id } = req.params;

  try {
    await pool.query(
      'DELETE FROM group_members WHERE group_id = $1',
      [id]
    );
    await pool.query(
      'DELETE FROM groups WHERE id = $1',
      [id]
    );
    res.status(200).json({ message: 'Group deleted successfully' });

  } catch(err) {
    res.status(404).json({ message: 'Error deleting group', error: err });
  }


}

module.exports = {
  create: createGroup,
  getAll: getAllGroups,
  getById: getGroupById,
  update: updateGroup,
  delete: deleteGroup,
};