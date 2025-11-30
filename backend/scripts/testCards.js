/**
 * Test script to verify all card actions work correctly
 */

const { drawCard, CHANCE_CARDS, COMMUNITY_CHEST_CARDS } = require('../game/mechanics/cards');

// Mock player
const mockPlayer = {
  id: 1,
  username: 'TestPlayer',
  position: 10,
  money: 1500,
  get_out_of_jail_cards: 0,
  is_in_jail: false,
  jail_turns: 0
};

// Mock other players
const mockPlayers = [
  mockPlayer,
  { id: 2, username: 'Player2', money: 1000, is_bankrupt: false },
  { id: 3, username: 'Player3', money: 1200, is_bankrupt: false }
];

// Mock properties
const mockProperties = [
  { id: 1, owner_id: 1, house_count: 2 },
  { id: 2, owner_id: 1, house_count: 5 }, // Hotel
  { id: 3, owner_id: 2, house_count: 1 }
];

console.log('=== TESTING CHANCE CARDS ===\n');
CHANCE_CARDS.forEach((card, index) => {
  console.log(`${index + 1}. ${card.text}`);
  console.log(`   Type: ${card.type}`);
  if (card.action) console.log(`   Action: ${card.action}`);
  if (card.position !== undefined) console.log(`   Position: ${card.position}`);
  if (card.amount !== undefined) console.log(`   Amount: ${card.amount}`);
  if (card.spaces !== undefined) console.log(`   Spaces: ${card.spaces}`);
  console.log('');
});

console.log('\n=== TESTING COMMUNITY CHEST CARDS ===\n');
COMMUNITY_CHEST_CARDS.forEach((card, index) => {
  console.log(`${index + 1}. ${card.text}`);
  console.log(`   Type: ${card.type}`);
  if (card.action) console.log(`   Action: ${card.action}`);
  if (card.position !== undefined) console.log(`   Position: ${card.position}`);
  if (card.amount !== undefined) console.log(`   Amount: ${card.amount}`);
  console.log('');
});

console.log('\n=== CARD TYPE SUMMARY ===\n');

const chanceTypes = CHANCE_CARDS.reduce((acc, card) => {
  acc[card.type] = (acc[card.type] || 0) + 1;
  return acc;
}, {});

const ccTypes = COMMUNITY_CHEST_CARDS.reduce((acc, card) => {
  acc[card.type] = (acc[card.type] || 0) + 1;
  return acc;
}, {});

console.log('Chance Cards by Type:');
Object.entries(chanceTypes).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});

console.log('\nCommunity Chest Cards by Type:');
Object.entries(ccTypes).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});

console.log('\n=== VERIFICATION ===\n');

// Verify all movement cards have proper action and position
const chanceMovementIssues = CHANCE_CARDS.filter(card => {
  if (card.type === 'move' && !card.action) {
    return true;
  }
  if (card.type === 'move' && card.action === 'position' && card.position === undefined) {
    return true;
  }
  return false;
});

const ccMovementIssues = COMMUNITY_CHEST_CARDS.filter(card => {
  if (card.type === 'move' && !card.action) {
    return true;
  }
  if (card.type === 'move' && card.action === 'position' && card.position === undefined) {
    return true;
  }
  return false;
});

if (chanceMovementIssues.length > 0) {
  console.log('⚠️  Chance cards with movement issues:');
  chanceMovementIssues.forEach(card => console.log(`   - ${card.text}`));
} else {
  console.log('✅ All Chance movement cards properly configured');
}

if (ccMovementIssues.length > 0) {
  console.log('⚠️  Community Chest cards with movement issues:');
  ccMovementIssues.forEach(card => console.log(`   - ${card.text}`));
} else {
  console.log('✅ All Community Chest movement cards properly configured');
}

// Check for "Advance to GO" cards specifically
const advanceToGoChance = CHANCE_CARDS.find(c => c.text.includes('Advance to GO'));
const advanceToGoCC = COMMUNITY_CHEST_CARDS.find(c => c.text.includes('Advance to GO'));

console.log('\n=== ADVANCE TO GO CARDS ===\n');
if (advanceToGoChance) {
  console.log('Chance "Advance to GO":');
  console.log(`  Type: ${advanceToGoChance.type} ${advanceToGoChance.type === 'move' ? '✅' : '❌ (should be move)'}`);
  console.log(`  Action: ${advanceToGoChance.action} ${advanceToGoChance.action === 'position' ? '✅' : '❌ (should be position)'}`);
  console.log(`  Position: ${advanceToGoChance.position} ${advanceToGoChance.position === 0 ? '✅' : '❌ (should be 0)'}`);
}

if (advanceToGoCC) {
  console.log('\nCommunity Chest "Advance to GO":');
  console.log(`  Type: ${advanceToGoCC.type} ${advanceToGoCC.type === 'move' ? '✅' : '❌ (should be move)'}`);
  console.log(`  Action: ${advanceToGoCC.action} ${advanceToGoCC.action === 'position' ? '✅' : '❌ (should be position)'}`);
  console.log(`  Position: ${advanceToGoCC.position} ${advanceToGoCC.position === 0 ? '✅' : '❌ (should be 0)'}`);
}

// Check Reading Railroad card
const readingRRCard = CHANCE_CARDS.find(c => c.text.includes('Reading Railroad'));
if (readingRRCard) {
  console.log('\nChance "Take a trip to Reading Railroad":');
  console.log(`  Type: ${readingRRCard.type} ${readingRRCard.type === 'move' ? '✅' : '❌ (should be move)'}`);
  console.log(`  Action: ${readingRRCard.action} ${readingRRCard.action === 'position' ? '✅' : '❌ (should be position)'}`);
  console.log(`  Position: ${readingRRCard.position} ${readingRRCard.position === 5 ? '✅' : '❌ (should be 5)'}`);
}

console.log('\n=== TEST COMPLETE ===\n');
