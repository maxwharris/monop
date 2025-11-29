/**
 * Player movement mechanics for Monopoly
 */

const { updatePlayer } = require('../../db/queries');

async function movePlayer(player, spaces) {
  const oldPosition = player.position;
  let newPosition = (oldPosition + spaces) % 40;

  // Handle negative movement (going backwards)
  if (newPosition < 0) {
    newPosition = 40 + newPosition;
  }

  // Check if passed GO (position 0)
  const passedGo = (oldPosition + spaces) >= 40 && spaces > 0;
  let moneyChange = 0;

  if (passedGo) {
    moneyChange = 200; // GO salary
  }

  // Update player in database
  await updatePlayer(player.id, {
    position: newPosition,
    money: player.money + moneyChange
  });

  return {
    oldPosition,
    newPosition,
    passedGo,
    moneyChange,
    newMoney: player.money + moneyChange
  };
}

module.exports = { movePlayer };
