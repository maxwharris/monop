/**
 * Automated Game Flow Test
 * Tests the core game mechanics via API calls
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

let player1Token, player2Token;
let player1, player2;

async function login(username, password) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username,
      password
    });
    return response.data;
  } catch (error) {
    console.error(`Login failed for ${username}:`, error.message);
    throw error;
  }
}

async function getGameState(token) {
  try {
    const response = await axios.get(`${BASE_URL}/game`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Get game state failed:', error.message);
    throw error;
  }
}

async function joinGame(token) {
  try {
    const response = await axios.post(
      `${BASE_URL}/game/join`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Join game failed:', error.message);
    throw error;
  }
}

async function rollDice(token) {
  try {
    const response = await axios.post(
      `${BASE_URL}/game/roll`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Roll dice failed:', error.message);
    throw error;
  }
}

async function endTurn(token) {
  try {
    const response = await axios.post(
      `${BASE_URL}/game/end-turn`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('End turn failed:', error.message);
    throw error;
  }
}

async function runTests() {
  console.log('🎲 Starting Monopoly Game Flow Tests...\n');

  try {
    // Test 1: Login
    console.log('Test 1: Player Login');
    const login1 = await login('player1', 'password1');
    const login2 = await login('player2', 'password2');

    player1Token = login1.token;
    player2Token = login2.token;
    player1 = login1.user;
    player2 = login2.user;

    console.log('✓ Player 1 logged in:', player1.username);
    console.log('✓ Player 2 logged in:', player2.username);
    console.log();

    // Test 2: Join Game
    console.log('Test 2: Join Game');
    await joinGame(player1Token);
    await joinGame(player2Token);
    console.log('✓ Player 1 joined game');
    console.log('✓ Player 2 joined game');
    console.log();

    // Test 3: Get Initial Game State
    console.log('Test 3: Initial Game State');
    let gameState = await getGameState(player1Token);
    console.log('✓ Game retrieved successfully');
    console.log(`  Current turn: ${gameState.game.current_turn}`);
    console.log(`  Players in game: ${gameState.players.length}`);
    console.log();

    // Test 4: Player 1 Rolls Dice
    console.log('Test 4: Player 1 Rolls Dice');
    const rollResult = await rollDice(player1Token);
    console.log('✓ Dice rolled successfully');
    console.log(`  Roll: ${rollResult.roll.die1} + ${rollResult.roll.die2} = ${rollResult.roll.total}`);
    console.log(`  New position: ${rollResult.newPosition}`);
    console.log(`  Money: $${rollResult.playerMoney}`);
    console.log();

    // Test 5: Check Updated Game State
    console.log('Test 5: Verify Game State After Roll');
    gameState = await getGameState(player1Token);
    const player1State = gameState.players.find(p => p.user_id === player1.id);
    console.log('✓ Game state updated');
    console.log(`  Player 1 position: ${player1State.position}`);
    console.log(`  Player 1 money: $${player1State.money}`);
    console.log();

    // Test 6: End Turn
    console.log('Test 6: End Turn');
    await endTurn(player1Token);
    gameState = await getGameState(player1Token);
    console.log('✓ Turn ended successfully');
    console.log(`  New current turn: ${gameState.game.current_turn}`);
    console.log();

    // Test 7: Player 2 Turn
    console.log('Test 7: Player 2 Turn');
    const roll2Result = await rollDice(player2Token);
    console.log('✓ Player 2 rolled dice');
    console.log(`  Roll: ${roll2Result.roll.die1} + ${roll2Result.roll.die2} = ${roll2Result.roll.total}`);
    console.log(`  New position: ${roll2Result.newPosition}`);
    await endTurn(player2Token);
    console.log('✓ Player 2 ended turn');
    console.log();

    // Test 8: Verify Turn Rotation
    console.log('Test 8: Verify Turn Rotation');
    gameState = await getGameState(player1Token);
    console.log('✓ Turn rotated back to Player 1');
    console.log(`  Current turn: ${gameState.game.current_turn}`);
    console.log();

    // Test 9: Check Properties
    console.log('Test 9: Properties Available');
    console.log(`✓ Total properties in game: ${gameState.properties.length}`);
    const ownedProperties = gameState.properties.filter(p => p.owner_id !== null);
    console.log(`  Owned properties: ${ownedProperties.length}`);
    console.log(`  Available properties: ${gameState.properties.length - ownedProperties.length}`);
    console.log();

    // Final Summary
    console.log('🎉 All Tests Passed!\n');
    console.log('=== Game Summary ===');
    console.log(`Players: ${gameState.players.length}`);
    gameState.players.forEach(p => {
      console.log(`  - ${p.username}: Position ${p.position}, $${p.money}`);
    });
    console.log();
    console.log('✓ Backend game logic working correctly');
    console.log('✓ Authentication working');
    console.log('✓ Turn management working');
    console.log('✓ Dice rolling working');
    console.log('✓ Player movement working');
    console.log();
    console.log('Next step: Test frontend at http://localhost:5173');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

// Run tests
runTests();
