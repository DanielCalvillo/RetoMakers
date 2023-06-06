const { pool } = require('../../conection');

async function createGroupMember(req, res) {
  const { groupId } = req.params;
  const { email } = req.body

  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (user.rows.length > 0) {
      const result = await pool.query(
        'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) RETURNING *',
        [groupId, user.rows[0].id]
      );
      res.status(201).json({ data: result.rows[0] });
    } else {
      res.status(401).json({ message: 'User not found' });

    }
  } catch (error) {
    console.error('Error creating group member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAllGroupMembers(req, res) {
  const { groupId } = req.params;

  let users = []
  try {
    const result = await pool.query(
      'SELECT * FROM group_members WHERE group_id = $1',
      [groupId]
    );

    for (const member of result.rows) {
      const user = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [member.user_id]
      );

      if (user) {
        users.push(user.rows[0]);
      }
    }
    res.status(200).json({ data: users });
  } catch (error) {
    console.error('Error fetching group members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ¿ Para qué necesito ésto?
// async function getGroupMemberById(req, res) {
//   const { groupId, memberId } = req.params;

//   try {
//     const result = await pool.query(
//       'SELECT * FROM group_members WHERE group_id = $1 AND id = $2',
//       [groupId, memberId]
//     );

//     if (result.rows.length > 0) {
//       res.status(200).json({ data: result.rows[0] });
//     } else {
//       res.status(404).json({ error: 'Group member not found' });
//     }
//   } catch (error) {
//     console.error('Error fetching group member:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

async function deleteGroupMember(req, res) {
  const { groupId } = req.params;
  const { email } = req.body

  try {

    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (user.rows.length > 0) {
      await pool.query(
        'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2',
        [groupId, user.rows[0].id]
      );
    }
    res.status(200).json({ message: 'Group member deleted successfully' });
  } catch (error) {
    console.error('Error deleting group member:', error);
    res.status(500).json({ error: 'Error deleting group member' });
  }
}

module.exports = {
  create: createGroupMember,
  getAll: getAllGroupMembers,
  // getById: getGroupMemberById,
  delete: deleteGroupMember,
};