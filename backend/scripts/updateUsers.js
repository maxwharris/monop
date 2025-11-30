/**
 * Update users in the database
 * Removes old users and creates new ones
 */

const pool = require('../db');
const bcrypt = require('bcryptjs');

const newUsers = [
  { username: 'max', password: 'max', token: 'car' },
  { username: 'jack', password: 'jack', token: 'hat' },
  { username: 'youngeun', password: 'youngeun', token: 'dog' },
  { username: 'seabass', password: 'seabass', token: 'ship' },
  { username: 'jason', password: 'jason', token: 'thimble' },
  { username: 'raymond', password: 'raymond', token: 'shoe' }
];

async function updateUsers() {
  try {
    console.log('Updating users...\n');

    // Delete all existing users
    await pool.query('DELETE FROM users');
    console.log('✓ Removed old users');

    // Create new users
    for (const user of newUsers) {
      const passwordHash = bcrypt.hashSync(user.password, 10);
      await pool.query(
        'INSERT INTO users (username, password_hash, token_type) VALUES ($1, $2, $3)',
        [user.username, passwordHash, user.token]
      );
      console.log(`✓ Created user: ${user.username}`);
    }

    console.log('\n🎮 Users updated successfully!');
    console.log('\nAvailable accounts:');
    newUsers.forEach(u => {
      console.log(`  ${u.username} / ${u.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  }
}

updateUsers();
