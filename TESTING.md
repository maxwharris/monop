# Monopoly Game - Testing Guide

## Server Status ✓

Both servers are currently running:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173
- **Backend API**: Verified working (authentication successful)

## Available Test Accounts

| Username | Password  | Token Type |
|----------|-----------|------------|
| player1  | password1 | car        |
| player2  | password2 | hat        |
| player3  | password3 | dog        |
| player4  | password4 | ship       |
| player5  | password5 | thimble    |

## Manual Testing Instructions

### 1. Test Multi-Player Game Flow

**Step 1: Open Multiple Browser Windows**
- Open 3-5 browser windows/tabs to http://localhost:5173
- Arrange them side-by-side to see real-time updates

**Step 2: Log In as Different Players**
- Window 1: Log in as `player1` / `password1`
- Window 2: Log in as `player2` / `password2`
- Window 3: Log in as `player3` / `password3`
- (Optional) Windows 4-5: Log in as player4/player5

**Step 3: Join the Game**
- Each player should automatically join the game on login
- Verify all players appear in the player list on all screens
- Check that player tokens appear on the GO space (position 0) on the 3D board

**Step 4: Test Turn Sequence**
- Player 1 should see "YOUR TURN" indicator and enabled buttons
- Other players should see disabled buttons
- Player 1 clicks "Roll Dice"
  - Verify dice values appear on all screens
  - Verify player token moves to new position on 3D board
  - Verify game log shows the move
  - Check if landed on property (can buy if unowned)
- Player 1 clicks "End Turn" (or "Buy Property" if applicable)
  - Verify turn passes to next player
  - Verify "YOUR TURN" moves to player 2 on all screens

**Step 5: Test Property Purchase**
- When a player lands on an unowned property:
  - "Buy Property" button should be enabled
  - Click "Buy Property"
  - Verify player's money decreases
  - Verify property shows ownership (gold tint on board)
  - Verify property appears in owned properties list
  - All screens update in real-time

**Step 6: Test Rent Payment**
- When a player lands on another player's property:
  - Verify rent is automatically deducted
  - Verify owner receives rent payment
  - Verify game log shows the transaction
  - Check all screens update immediately

**Step 7: Test Special Spaces**
- **GO (Position 0)**: Verify $200 salary when passing/landing
- **Income Tax (Position 4)**: Verify $200 deduction
- **Jail (Position 10)**: Just visiting, no action
- **Free Parking (Position 20)**: No action
- **Go to Jail (Position 30)**: Player moves to jail, in jail status
- **Luxury Tax (Position 38)**: Verify $100 deduction

**Step 8: Test Jail Mechanics**
- Get sent to jail (land on "Go to Jail" or draw a "Go to Jail" card)
- Options to get out:
  - Pay $50 fine
  - Roll doubles
  - Use "Get Out of Jail Free" card (if owned)
  - Automatic release after 3 turns

**Step 9: Test Chance/Community Chest**
- Land on Chance (positions 7, 22, 36)
- Land on Community Chest (positions 2, 17, 33)
- Verify card text appears
- Verify card effects apply (money, movement, jail, etc.)

**Step 10: Test Doubles**
- When player rolls doubles:
  - Verify they get another turn
  - Verify doubles counter increments
  - Roll 3 doubles in a row → player goes to jail

**Step 11: Test Chat**
- Send messages from different players
- Verify messages appear on all screens in real-time
- Verify username appears with each message
- Check auto-scroll to latest message

**Step 12: Test Monopoly Rent**
- Own all properties of one color group
- Verify rent doubles on unimproved properties
- Add houses/hotels (future feature - not yet implemented)

**Step 13: Test Bankruptcy**
- Play until one player runs out of money
- Verify player is marked as bankrupt
- Verify player is removed from turn rotation
- Verify their properties become available for purchase

**Step 14: Test Game Over**
- Continue until only one player remains solvent
- Verify game over state
- Verify winner is announced

## API Testing (Optional)

### Test Authentication
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"player1","password":"password1"}'
```

Expected: Returns JWT token and user object

### Test Game State (with token)
```bash
curl http://localhost:3001/api/game \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected: Returns current game state

## Known Issues & Future Enhancements

### Not Yet Implemented
- **Trading**: Player-to-player property trades
- **Mortgaging**: Mortgage properties for cash
- **Auctions**: Property auctions when player declines to buy
- **Building**: Houses and hotels (data structure ready, UI pending)
- **AI Players**: Computer-controlled players
- **Game Persistence**: Save/load game state
- **Animations**: Smooth token movement, dice rolling animations
- **3D Assets**: Replace geometric shapes with textured 3D models

### Current Limitations
- No game restart button (refresh page to reset)
- No player kick/spectator mode
- No game history/replay
- Single game instance only (no multiple game rooms)

## Success Criteria ✓

The MVP is considered working if you can:
- [x] Log in as multiple players
- [x] Join the game
- [x] See all players on the board
- [x] Take turns rolling dice
- [x] Move around the board
- [x] Buy properties
- [x] Pay rent
- [x] See real-time updates on all screens
- [x] Use chat functionality
- [x] Handle special spaces (tax, jail, cards)
- [x] Detect game over/winner

## Troubleshooting

### Frontend won't load
- Check that Vite server is running on port 5173
- Run: `cd frontend && npm run dev`

### Backend errors
- Check that PostgreSQL is running
- Verify database credentials in `backend/.env`
- Check port 3001 is available
- Run: `cd backend && npm start`

### Database connection issues
- Verify PostgreSQL is running on port 5433
- Username: `postgres`, Password: `monopoly`
- Database: `monopoly`
- Run test: `node backend/scripts/testDb.js`

### WebSocket not connecting
- Check CORS settings in `backend/index.js`
- Verify FRONTEND_URL in `backend/.env` is `http://localhost:5173`
- Check browser console for connection errors

### Players not seeing each other
- Verify all players are logged in and connected
- Check backend console for "User authenticated" messages
- Verify Socket.io connection in browser dev tools (Network tab)

## Next Steps

After verifying the MVP works:
1. Add 3D assets to replace geometric shapes
2. Implement trading system
3. Add house/hotel building
4. Implement mortgaging
5. Add property auctions
6. Create better UI/UX
7. Add animations
8. Implement game rooms (multiple concurrent games)
9. Add spectator mode
10. Implement AI players
