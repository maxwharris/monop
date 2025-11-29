/**
 * Jail mechanics for Monopoly
 */

const { updatePlayer } = require('../../db/queries');

async function sendToJail(player) {
  await updatePlayer(player.id, {
    position: 10, // Jail position
    isInJail: true,
    jailTurns: 0
  });

  return { success: true, position: 10 };
}

async function tryGetOutOfJail(player, method) {
  if (!player.is_in_jail) {
    throw new Error('Player not in jail');
  }

  if (method === 'pay') {
    if (player.money < 50) {
      throw new Error('Insufficient funds to pay jail fine');
    }

    await updatePlayer(player.id, {
      money: player.money - 50,
      isInJail: false,
      jailTurns: 0
    });

    return {
      success: true,
      method: 'paid',
      amount: 50,
      newMoney: player.money - 50
    };
  }

  if (method === 'card') {
    if (player.get_out_of_jail_cards === 0) {
      throw new Error('No Get Out of Jail Free cards');
    }

    await updatePlayer(player.id, {
      getOutOfJailCards: player.get_out_of_jail_cards - 1,
      isInJail: false,
      jailTurns: 0
    });

    return {
      success: true,
      method: 'card',
      cardsRemaining: player.get_out_of_jail_cards - 1
    };
  }

  if (method === 'doubles') {
    // This is called when player rolls doubles while in jail
    await updatePlayer(player.id, {
      isInJail: false,
      jailTurns: 0
    });

    return {
      success: true,
      method: 'doubles'
    };
  }

  throw new Error('Invalid jail escape method');
}

async function incrementJailTurns(player) {
  const newTurns = player.jail_turns + 1;

  if (newTurns >= 3) {
    // Must pay fine or use card after 3 turns
    if (player.get_out_of_jail_cards > 0) {
      return await tryGetOutOfJail(player, 'card');
    } else if (player.money >= 50) {
      return await tryGetOutOfJail(player, 'pay');
    } else {
      throw new Error('Cannot afford jail fine after 3 turns');
    }
  } else {
    await updatePlayer(player.id, {
      jailTurns: newTurns
    });

    return {
      success: true,
      jailTurns: newTurns,
      mustPayNext: newTurns === 2
    };
  }
}

module.exports = {
  sendToJail,
  tryGetOutOfJail,
  incrementJailTurns
};
