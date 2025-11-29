const pool = require('../db');
const properties = require('../data/properties');

async function seedProperties() {
  console.log('Seeding properties into database...\n');

  let count = 0;

  for (const prop of properties) {
    // Only seed properties that can be purchased (not special spaces)
    if (prop.type === 'property' || prop.type === 'railroad' || prop.type === 'utility') {
      try {
        await pool.query(
          `INSERT INTO properties
          (name, property_type, color_group, position_on_board, purchase_price, rent_base, rent_values, house_cost, mortgage_value)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (game_id, position_on_board) DO NOTHING`,
          [
            prop.name,
            prop.type,
            prop.colorGroup || null,
            prop.position,
            prop.price,
            prop.rent[0],
            JSON.stringify(prop.rent),
            prop.houseCost || null,
            prop.mortgageValue
          ]
        );
        console.log(`✓ Added: ${prop.name} (position ${prop.position})`);
        count++;
      } catch (error) {
        console.error(`✗ Error adding ${prop.name}:`, error.message);
      }
    }
  }

  console.log(`\n✅ Seeded ${count} properties successfully!`);
  console.log('Properties breakdown:');
  console.log('  - 22 standard properties');
  console.log('  - 4 railroads');
  console.log('  - 2 utilities');
  console.log('  = 28 total purchasable properties\n');

  process.exit(0);
}

seedProperties().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
