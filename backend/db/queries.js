const pool = require('../db');

// User queries
async function getUserById(userId) {
  const result = await pool.query(
    'SELECT id, username, token_type FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0];
}

// Game queries
async function getGame() {
  const result = await pool.query('SELECT * FROM game WHERE id = 1');
  return result.rows[0];
}

async function updateGame(updates) {
  const { currentTurnUserId, turnDeadline, status } = updates;
  const result = await pool.query(
    `UPDATE game SET
      current_turn_user_id = COALESCE($1, current_turn_user_id),
      turn_deadline = COALESCE($2, turn_deadline),
      status = COALESCE($3, status)
    WHERE id = 1 RETURNING *`,
    [currentTurnUserId, turnDeadline, status]
  );
  return result.rows[0];
}

// Player queries
async function getAllPlayers() {
  const result = await pool.query(`
    SELECT p.*, u.username, u.token_type
    FROM players p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.turn_order
  `);
  return result.rows;
}

async function getPlayerByUserId(userId) {
  const result = await pool.query(
    `SELECT p.*, u.username, u.token_type
     FROM players p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1`,
    [userId]
  );
  return result.rows[0];
}

async function getPlayerById(playerId) {
  const result = await pool.query(
    `SELECT p.*, u.username, u.token_type
     FROM players p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`,
    [playerId]
  );
  return result.rows[0];
}

async function createPlayer(userId, turnOrder) {
  const result = await pool.query(
    `INSERT INTO players (user_id, turn_order)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, turnOrder]
  );
  return result.rows[0];
}

async function updatePlayer(playerId, updates) {
  const { money, position, isInJail, jailTurns, getOutOfJailCards, isBankrupt } = updates;
  const result = await pool.query(
    `UPDATE players SET
      money = COALESCE($2, money),
      position = COALESCE($3, position),
      is_in_jail = COALESCE($4, is_in_jail),
      jail_turns = COALESCE($5, jail_turns),
      get_out_of_jail_cards = COALESCE($6, get_out_of_jail_cards),
      is_bankrupt = COALESCE($7, is_bankrupt),
      last_active = CURRENT_TIMESTAMP
    WHERE id = $1 RETURNING *`,
    [playerId, money, position, isInJail, jailTurns, getOutOfJailCards, isBankrupt]
  );
  return result.rows[0];
}

// Property queries
async function getAllProperties() {
  const result = await pool.query('SELECT * FROM properties ORDER BY position_on_board');
  return result.rows;
}

async function getPropertyByPosition(position) {
  const result = await pool.query(
    'SELECT * FROM properties WHERE position_on_board = $1',
    [position]
  );
  return result.rows[0];
}

async function getPropertyById(propertyId) {
  const result = await pool.query(
    'SELECT * FROM properties WHERE id = $1',
    [propertyId]
  );
  return result.rows[0];
}

async function updateProperty(propertyId, updates) {
  const { ownerId, isMortgaged, houseCount } = updates;
  const result = await pool.query(
    `UPDATE properties SET
      owner_id = COALESCE($2, owner_id),
      is_mortgaged = COALESCE($3, is_mortgaged),
      house_count = COALESCE($4, house_count)
    WHERE id = $1 RETURNING *`,
    [propertyId, ownerId, isMortgaged, houseCount]
  );
  return result.rows[0];
}

// Game action logging
async function logGameAction(playerId, actionType, actionData) {
  await pool.query(
    'INSERT INTO game_actions (player_id, action_type, action_data) VALUES ($1, $2, $3)',
    [playerId, actionType, JSON.stringify(actionData)]
  );
}

// Chat queries
async function getChatMessages(limit = 100) {
  const result = await pool.query(
    `SELECT c.*, u.username
     FROM game_chat c
     JOIN users u ON c.user_id = u.id
     ORDER BY c.timestamp DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows.reverse();
}

async function createChatMessage(userId, message) {
  const result = await pool.query(
    'INSERT INTO game_chat (user_id, message) VALUES ($1, $2) RETURNING *',
    [userId, message]
  );
  return result.rows[0];
}

module.exports = {
  getUserById,
  getGame,
  updateGame,
  getAllPlayers,
  getPlayerByUserId,
  getPlayerById,
  createPlayer,
  updatePlayer,
  getAllProperties,
  getPropertyByPosition,
  getPropertyById,
  updateProperty,
  logGameAction,
  getChatMessages,
  createChatMessage
};
