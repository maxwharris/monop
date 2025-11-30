// Complete Monopoly board data (40 spaces)
// Property values taken from official Monopoly game
module.exports = [
  // Corner: GO
  { position: 0, name: 'GO', type: 'special' },

  // Brown properties
  {
    position: 1,
    name: 'Mediterranean Avenue',
    type: 'property',
    colorGroup: 'brown',
    price: 60,
    rent: [2, 4, 10, 30, 90, 160, 250], // base, with_set, 1H, 2H, 3H, 4H, hotel
    houseCost: 50,
    mortgageValue: 30
  },

  // Community Chest
  { position: 2, name: 'Community Chest', type: 'special' },

  {
    position: 3,
    name: 'Baltic Avenue',
    type: 'property',
    colorGroup: 'brown',
    price: 60,
    rent: [4, 8, 20, 60, 180, 320, 450],
    houseCost: 50,
    mortgageValue: 30
  },

  // Income Tax
  { position: 4, name: 'Income Tax', type: 'special' },

  // Railroad
  {
    position: 5,
    name: 'Reading Railroad',
    type: 'railroad',
    colorGroup: 'railroad',
    price: 200,
    rent: [25, 50, 100, 200], // 1RR, 2RR, 3RR, 4RR
    houseCost: null,
    mortgageValue: 100
  },

  // Light Blue properties
  {
    position: 6,
    name: 'Oriental Avenue',
    type: 'property',
    colorGroup: 'lightblue',
    price: 100,
    rent: [6, 12, 30, 90, 270, 400, 550],
    houseCost: 50,
    mortgageValue: 50
  },

  // Chance
  { position: 7, name: 'Chance', type: 'special' },

  {
    position: 8,
    name: 'Vermont Avenue',
    type: 'property',
    colorGroup: 'lightblue',
    price: 100,
    rent: [6, 12, 30, 90, 270, 400, 550],
    houseCost: 50,
    mortgageValue: 50
  },

  {
    position: 9,
    name: 'Connecticut Avenue',
    type: 'property',
    colorGroup: 'lightblue',
    price: 120,
    rent: [8, 16, 40, 100, 300, 450, 600],
    houseCost: 50,
    mortgageValue: 60
  },

  // Corner: Jail / Just Visiting
  { position: 10, name: 'Jail / Just Visiting', type: 'special' },

  // Pink properties
  {
    position: 11,
    name: 'St. Charles Place',
    type: 'property',
    colorGroup: 'pink',
    price: 140,
    rent: [10, 20, 50, 150, 450, 625, 750],
    houseCost: 100,
    mortgageValue: 70
  },

  // Utility
  {
    position: 12,
    name: 'Electric Company',
    type: 'utility',
    colorGroup: 'utility',
    price: 150,
    rent: [4, 10], // 4x or 10x dice roll
    houseCost: null,
    mortgageValue: 75
  },

  {
    position: 13,
    name: 'States Avenue',
    type: 'property',
    colorGroup: 'pink',
    price: 140,
    rent: [10, 20, 50, 150, 450, 625, 750],
    houseCost: 100,
    mortgageValue: 70
  },

  {
    position: 14,
    name: 'Virginia Avenue',
    type: 'property',
    colorGroup: 'pink',
    price: 160,
    rent: [12, 24, 60, 180, 500, 700, 900],
    houseCost: 100,
    mortgageValue: 80
  },

  // Railroad
  {
    position: 15,
    name: 'Pennsylvania Railroad',
    type: 'railroad',
    colorGroup: 'railroad',
    price: 200,
    rent: [25, 50, 100, 200],
    houseCost: null,
    mortgageValue: 100
  },

  // Orange properties
  {
    position: 16,
    name: 'St. James Place',
    type: 'property',
    colorGroup: 'orange',
    price: 180,
    rent: [14, 28, 70, 200, 550, 750, 950],
    houseCost: 100,
    mortgageValue: 90
  },

  // Community Chest
  { position: 17, name: 'Community Chest', type: 'special' },

  {
    position: 18,
    name: 'Tennessee Avenue',
    type: 'property',
    colorGroup: 'orange',
    price: 180,
    rent: [14, 28, 70, 200, 550, 750, 950],
    houseCost: 100,
    mortgageValue: 90
  },

  {
    position: 19,
    name: 'New York Avenue',
    type: 'property',
    colorGroup: 'orange',
    price: 200,
    rent: [16, 32, 80, 220, 600, 800, 1000],
    houseCost: 100,
    mortgageValue: 100
  },

  // Corner: Free Parking
  { position: 20, name: 'Free Parking', type: 'special' },

  // Red properties
  {
    position: 21,
    name: 'Kentucky Avenue',
    type: 'property',
    colorGroup: 'red',
    price: 220,
    rent: [18, 36, 90, 250, 700, 875, 1050],
    houseCost: 150,
    mortgageValue: 110
  },

  // Chance
  { position: 22, name: 'Chance', type: 'special' },

  {
    position: 23,
    name: 'Indiana Avenue',
    type: 'property',
    colorGroup: 'red',
    price: 220,
    rent: [18, 36, 90, 250, 700, 875, 1050],
    houseCost: 150,
    mortgageValue: 110
  },

  {
    position: 24,
    name: 'Illinois Avenue',
    type: 'property',
    colorGroup: 'red',
    price: 240,
    rent: [20, 40, 100, 300, 750, 925, 1100],
    houseCost: 150,
    mortgageValue: 120
  },

  // Railroad
  {
    position: 25,
    name: 'B. & O. Railroad',
    type: 'railroad',
    colorGroup: 'railroad',
    price: 200,
    rent: [25, 50, 100, 200],
    houseCost: null,
    mortgageValue: 100
  },

  // Yellow properties
  {
    position: 26,
    name: 'Atlantic Avenue',
    type: 'property',
    colorGroup: 'yellow',
    price: 260,
    rent: [22, 44, 110, 330, 800, 975, 1150],
    houseCost: 150,
    mortgageValue: 130
  },

  {
    position: 27,
    name: 'Ventnor Avenue',
    type: 'property',
    colorGroup: 'yellow',
    price: 260,
    rent: [22, 44, 110, 330, 800, 975, 1150],
    houseCost: 150,
    mortgageValue: 130
  },

  // Utility
  {
    position: 28,
    name: 'Water Works',
    type: 'utility',
    colorGroup: 'utility',
    price: 150,
    rent: [4, 10], // 4x or 10x dice roll
    houseCost: null,
    mortgageValue: 75
  },

  {
    position: 29,
    name: 'Marvin Gardens',
    type: 'property',
    colorGroup: 'yellow',
    price: 280,
    rent: [24, 48, 120, 360, 850, 1025, 1200],
    houseCost: 150,
    mortgageValue: 140
  },

  // Corner: Go to Jail
  { position: 30, name: 'Go to Jail', type: 'special' },

  // Green properties
  {
    position: 31,
    name: 'Pacific Avenue',
    type: 'property',
    colorGroup: 'green',
    price: 300,
    rent: [26, 52, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    mortgageValue: 150
  },

  {
    position: 32,
    name: 'North Carolina Avenue',
    type: 'property',
    colorGroup: 'green',
    price: 300,
    rent: [26, 52, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    mortgageValue: 150
  },

  // Community Chest
  { position: 33, name: 'Community Chest', type: 'special' },

  {
    position: 34,
    name: 'Pennsylvania Avenue',
    type: 'property',
    colorGroup: 'green',
    price: 320,
    rent: [28, 56, 150, 450, 1000, 1200, 1400],
    houseCost: 200,
    mortgageValue: 160
  },

  // Railroad
  {
    position: 35,
    name: 'Short Line',
    type: 'railroad',
    colorGroup: 'railroad',
    price: 200,
    rent: [25, 50, 100, 200],
    houseCost: null,
    mortgageValue: 100
  },

  // Chance
  { position: 36, name: 'Chance', type: 'special' },

  // Dark Blue properties
  {
    position: 37,
    name: 'Park Place',
    type: 'property',
    colorGroup: 'darkblue',
    price: 350,
    rent: [35, 70, 175, 500, 1100, 1300, 1500],
    houseCost: 200,
    mortgageValue: 175
  },

  // Luxury Tax
  { position: 38, name: 'Luxury Tax', type: 'special' },

  {
    position: 39,
    name: 'Boardwalk',
    type: 'property',
    colorGroup: 'darkblue',
    price: 400,
    rent: [50, 100, 200, 600, 1400, 1700, 2000],
    houseCost: 200,
    mortgageValue: 200
  }
];
