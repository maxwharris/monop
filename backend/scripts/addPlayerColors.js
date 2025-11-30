/**
 * Add player_color column to players table
 */

const pool = require('../db');

async function addPlayerColors() {
  try {
    console.log('Adding player_color column to players table...\n');

    // Add column
    await pool.query(`
      ALTER TABLE players
      ADD COLUMN IF NOT EXISTS player_color VARCHAR(20)
    `);
    console.log('✓ Added player_color column');

    // Assign colors to existing players based on turn order
    await pool.query(`
      UPDATE players SET player_color = CASE turn_order
        WHEN 1 THEN 'red'
        WHEN 2 THEN 'blue'
        WHEN 3 THEN 'green'
        WHEN 4 THEN 'yellow'
        WHEN 5 THEN 'purple'
        WHEN 6 THEN 'orange'
        ELSE 'gray'
      END
      WHERE player_color IS NULL
    `);
    console.log('✓ Assigned colors to existing players');

    console.log('\n✅ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

addPlayerColors();
