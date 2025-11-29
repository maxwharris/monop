const pool = require('../db');

async function testDatabase() {
  console.log('Testing database connection...\n');

  try {
    // Test basic connection
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful!');
    console.log(`  Server time: ${result.rows[0].now}\n`);

    // Test users table
    const users = await pool.query('SELECT id, username, token_type FROM users');
    console.log(`✓ Users table: ${users.rows.length} users found`);
    users.rows.forEach(user => {
      console.log(`  - ${user.username} (${user.token_type})`);
    });
    console.log('');

    // Test game table
    const game = await pool.query('SELECT * FROM game WHERE id = 1');
    if (game.rows.length > 0) {
      console.log('✓ Game table: Game instance found');
      console.log(`  Status: ${game.rows[0].status}`);
      console.log('');
    } else {
      console.log('⚠ Game table: No game instance found\n');
    }

    // Test properties table
    const properties = await pool.query('SELECT COUNT(*) FROM properties');
    console.log(`✓ Properties table: ${properties.rows[0].count} properties`);
    console.log('');

    // Test players table
    const players = await pool.query('SELECT COUNT(*) FROM players');
    console.log(`ℹ Players table: ${players.rows[0].count} players\n`);

    console.log('✅ Database test complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database error:', error.message);
    console.error('\nMake sure:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database "monopoly" exists');
    console.error('3. backend/.env has correct DATABASE_URL');
    console.error('4. schema.sql has been executed');
    console.error('\nTo create database and tables, run:');
    console.error('  psql -U postgres -f backend/schema.sql\n');
    process.exit(1);
  }
}

testDatabase();
