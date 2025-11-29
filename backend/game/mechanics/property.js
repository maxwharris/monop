/**
 * Property system mechanics for Monopoly
 */

const { updateProperty, updatePlayer, getAllProperties } = require('../../db/queries');

async function canBuyProperty(player, property) {
  return (
    property.owner_id === null &&
    player.money >= property.purchase_price &&
    !player.is_bankrupt &&
    !property.is_mortgaged
  );
}

async function purchaseProperty(player, property) {
  // Provide specific error messages
  if (property.owner_id !== null) {
    throw new Error('Property is already owned');
  }
  if (player.money < property.purchase_price) {
    throw new Error(`Insufficient funds. Need $${property.purchase_price}, have $${player.money}`);
  }
  if (player.is_bankrupt) {
    throw new Error('Cannot purchase property while bankrupt');
  }
  if (property.is_mortgaged) {
    throw new Error('Property is mortgaged');
  }

  // Deduct money from player
  await updatePlayer(player.id, {
    money: player.money - property.purchase_price
  });

  // Assign ownership
  await updateProperty(property.id, {
    ownerId: player.id
  });

  return {
    success: true,
    newMoney: player.money - property.purchase_price
  };
}

async function calculateRent(property, diceRoll = null) {
  if (property.is_mortgaged || property.owner_id === null) {
    return 0;
  }

  // Get all properties to check ownership in groups
  const allProperties = await getAllProperties();

  if (property.property_type === 'property') {
    // Standard property - rent based on house count
    const rentValues = JSON.parse(property.rent_values);
    let rent = rentValues[property.house_count] || rentValues[0];

    // Check if owner owns all properties in color group (doubles rent with no houses)
    if (property.house_count === 0 && property.color_group) {
      const colorGroupProperties = allProperties.filter(
        p => p.color_group === property.color_group
      );
      const ownsAll = colorGroupProperties.every(p => p.owner_id === property.owner_id);

      if (ownsAll) {
        rent = rent * 2; // Double rent for monopoly
      }
    }

    return rent;
  }

  if (property.property_type === 'railroad') {
    // Count how many railroads the owner has
    const railroads = allProperties.filter(
      p => p.property_type === 'railroad' && p.owner_id === property.owner_id
    );
    const count = railroads.length;

    const rentValues = [25, 50, 100, 200];
    return rentValues[count - 1] || 0;
  }

  if (property.property_type === 'utility') {
    // Count how many utilities the owner has
    const utilities = allProperties.filter(
      p => p.property_type === 'utility' && p.owner_id === property.owner_id
    );
    const count = utilities.length;

    // If dice roll provided, use it; otherwise return multiplier
    const multiplier = count === 2 ? 10 : 4;

    if (diceRoll !== null) {
      return multiplier * diceRoll;
    }

    return multiplier; // Return multiplier if no dice roll provided
  }

  return 0;
}

async function payRent(payer, owner, amount) {
  // Deduct from payer
  await updatePlayer(payer.id, {
    money: payer.money - amount
  });

  // Add to owner
  await updatePlayer(owner.id, {
    money: owner.money + amount
  });

  return {
    success: true,
    payerNewMoney: payer.money - amount,
    ownerNewMoney: owner.money + amount
  };
}

module.exports = {
  canBuyProperty,
  purchaseProperty,
  calculateRent,
  payRent
};
