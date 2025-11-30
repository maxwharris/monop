/**
 * Test card movement calculations to ensure they work correctly
 */

console.log('=== TESTING CARD MOVEMENT CALCULATIONS ===\n');

function calculateMovement(currentPos, targetPos) {
  let spacesToMove;
  if (targetPos > currentPos) {
    // Target is ahead on the board
    spacesToMove = targetPos - currentPos;
  } else if (targetPos < currentPos) {
    // Target is behind, need to go around the board
    spacesToMove = 40 - currentPos + targetPos;
  } else {
    // Already at target position, go around the full board
    spacesToMove = 40;
  }
  return spacesToMove;
}

function testMovement(currentPos, targetPos, expectedSpaces, description) {
  const spaces = calculateMovement(currentPos, targetPos);
  const finalPos = (currentPos + spaces) % 40;
  const passesGo = (currentPos + spaces) >= 40;
  const status = spaces === expectedSpaces ? '✅' : '❌';

  console.log(`${status} ${description}`);
  console.log(`   Current: ${currentPos}, Target: ${targetPos}`);
  console.log(`   Calculated spaces: ${spaces} (expected: ${expectedSpaces})`);
  console.log(`   Final position: ${finalPos} (should be: ${targetPos})`);
  console.log(`   Passes GO: ${passesGo ? 'Yes' : 'No'}`);

  if (finalPos !== targetPos) {
    console.log(`   ⚠️  WARNING: Final position doesn't match target!`);
  }
  console.log('');

  return spaces === expectedSpaces && finalPos === targetPos;
}

let allPassed = true;

// Test Advance to GO from various positions
console.log('--- Advance to GO (position 0) ---\n');
allPassed &= testMovement(10, 0, 30, 'From position 10 to GO');
allPassed &= testMovement(30, 0, 10, 'From position 30 to GO');
allPassed &= testMovement(0, 0, 40, 'Already at GO (should go around)');
allPassed &= testMovement(39, 0, 1, 'From Boardwalk to GO');

// Test other specific positions
console.log('--- Other Movement Cards ---\n');
allPassed &= testMovement(10, 5, 35, 'From 10 to Reading Railroad (pos 5)');
allPassed &= testMovement(2, 5, 3, 'From 2 to Reading Railroad (pos 5)');
allPassed &= testMovement(10, 24, 14, 'From 10 to Illinois Ave (pos 24)');
allPassed &= testMovement(30, 24, 34, 'From 30 to Illinois Ave (pos 24)');
allPassed &= testMovement(10, 11, 1, 'From 10 to St. Charles Place (pos 11)');
allPassed &= testMovement(20, 11, 31, 'From 20 to St. Charles Place (pos 11)');
allPassed &= testMovement(10, 39, 29, 'From 10 to Boardwalk (pos 39)');
allPassed &= testMovement(38, 39, 1, 'From 38 to Boardwalk (pos 39)');

// Test nearest railroad logic
console.log('--- Nearest Railroad (5, 15, 25, 35) ---\n');
function findNearestRailroad(pos) {
  const railroads = [5, 15, 25, 35];
  return railroads.find(r => r > pos) || railroads[0];
}

const testPositions = [0, 6, 12, 16, 22, 26, 32, 36];
testPositions.forEach(pos => {
  const nearest = findNearestRailroad(pos);
  const spaces = calculateMovement(pos, nearest);
  const finalPos = (pos + spaces) % 40;
  const status = finalPos === nearest ? '✅' : '❌';
  console.log(`${status} From position ${pos} -> Nearest Railroad ${nearest} (${spaces} spaces)`);
  allPassed &= (finalPos === nearest);
});

// Test nearest utility logic
console.log('\n--- Nearest Utility (12, 28) ---\n');
function findNearestUtility(pos) {
  const utilities = [12, 28];
  return utilities.find(u => u > pos) || utilities[0];
}

const testUtilityPositions = [0, 10, 13, 20, 29, 35];
testUtilityPositions.forEach(pos => {
  const nearest = findNearestUtility(pos);
  const spaces = calculateMovement(pos, nearest);
  const finalPos = (pos + spaces) % 40;
  const status = finalPos === nearest ? '✅' : '❌';
  console.log(`${status} From position ${pos} -> Nearest Utility ${nearest} (${spaces} spaces)`);
  allPassed &= (finalPos === nearest);
});

console.log('\n=== RESULT ===\n');
if (allPassed) {
  console.log('✅ All movement calculations are CORRECT!');
} else {
  console.log('❌ Some movement calculations FAILED!');
}
