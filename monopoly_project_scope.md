# Online Monopoly Game - Project Scope Document

## Project Overview
Build a long-form, asynchronous online Monopoly-style board game using React with high-quality 3D graphics. The game should follow traditional Monopoly rules but be optimized for play over extended periods (days/weeks) with players taking turns asynchronously.

**IMPORTANT: This is a single-instance game with password protection and 5 hardcoded player accounts.**

## Technology Stack

### Frontend
- **React** (latest version)
- **React Three Fiber** (@react-three/fiber) for 3D graphics
- **React Three Drei** (@react-three/drei) for 3D helpers and controls
- **Three.js** (bundled with React Three Fiber)
- **Tailwind CSS** for UI components
- **Zustand or Redux** for state management

### Backend Architecture
- **Node.js** with Express for API server
- **Socket.io** for real-time WebSocket connections
- **PostgreSQL** for persistent data storage
- **JWT** for session management

### Deployment
- Frontend: Vercel, Netlify, or AWS Amplify
- Backend: Railway, Render, or AWS
- Database: Managed PostgreSQL (Supabase, AWS RDS, or Railway)

## Authentication & Access Control

### Hardcoded Accounts (5 Players)
The system will have exactly 5 hardcoded user accounts with no registration system:

```
Player 1:
  - username: "player1"
  - password: "password1" (will be hashed in database)
  - token: "car"

Player 2:
  - username: "player2"
  - password: "password2"
  - token: "hat"

Player 3:
  - username: "player3"
  - password: "password3"
  - token: "dog"

Player 4:
  - username: "player4"
  - password: "password4"
  - token: "ship"

Player 5:
  - username: "player5"
  - password: "password5"
  - token: "thimble"
```

### Access Requirements
- No public access - password required to enter site
- No user registration or account creation
- No guest accounts
- Simple login page with username/password
- Session persists with JWT token
- Logout functionality
- All 5 players can log in simultaneously to play the single game instance

## Core Features

### 1. Single Game Instance
- Only ONE game exists in the system at any time
- Game state persists across sessions
- Players join the same game when they log in
- Game can be reset by any player (with confirmation)
- No game lobby system needed
- No multiple game rooms

### 2. Authentication System
- Simple login form (username + password)
- Password validation against hardcoded accounts
- JWT token generation for session
- Token stored in localStorage/sessionStorage
- Protected routes (redirect to login if not authenticated)
- Logout clears token and redirects to login

### 3. 3D Game Board
- Full 3D Monopoly board with 40 spaces
- Properties grouped by color sets
- Corner squares (GO, Jail, Free Parking, Go to Jail)
- Railroads and utilities
- Camera controls (rotate, zoom, pan)
- Clickable spaces for property information
- Visual indicators for owned properties (color-coded by owner)
- Hover effects on properties

### 4. 3D Game Pieces & Animations
- 5 distinct 3D player tokens (car, hat, dog, ship, thimble)
- Smooth movement animation along board path
- Animated 3D dice rolling with physics
- Camera follows active player's token
- Landing animations (bounce, celebration effects)
- Property purchase effects (visual feedback)

### 5. Core Gameplay Mechanics

#### Turn Management
- Asynchronous turn-based system
- Turn timer (configurable: 1 hour - 7 days)
- Skip turn if player times out
- Turn order indicator
- "Your turn" notifications

#### Dice Rolling
- 3D animated dice with realistic physics
- Doubles detection (roll again)
- Three consecutive doubles → Go to Jail
- Visual roll history

#### Property Management
- Buy unowned properties
- Auction system if player declines to buy
- Property cards with full details
- Build houses/hotels (with color set monopoly)
- Mortgage/unmortgage properties
- Visual building indicators on board (3D houses/hotels)

#### Trading System
- Player-to-player trade interface
- Trade properties, money, Get Out of Jail cards
- Trade proposals and counter-offers
- All players notified of trades
- Trade history log

#### Banking
- Starting money (default $1500)
- Salary for passing GO ($200)
- Rent collection (automatic)
- Property purchases
- Building purchases
- Tax payments
- Fine payments

#### Chance & Community Chest
- Card draw animations
- Card display with 3D effects
- Get Out of Jail Free cards
- Movement cards
- Money cards
- All traditional card types

#### Jail System
- Go to Jail space
- Rolling doubles to get out
- Pay $50 fine
- Use Get Out of Jail Free card
- Three turns maximum

### 6. UI Components

#### Main Game Screen
- 3D board viewport (central, largest element)
- Player list sidebar (current money, properties owned)
- Current player indicator
- Action buttons (Roll Dice, End Turn, Manage Properties, Trade)
- Chat/message system
- Game log (recent actions)
- Property quick view panel
- Reset Game button (with confirmation modal)

#### Property Management Panel
- List of owned properties
- Build/sell houses interface
- Mortgage/unmortgage interface
- Property details and rent values

#### Trade Interface
- Drag-and-drop property selection
- Money input fields
- Proposal/counter-proposal system
- Accept/decline buttons
- Trade history

#### Game Settings
- Sound effects toggle
- Music toggle
- Camera sensitivity
- Notification preferences
- Graphics quality settings

### 7. Real-Time Features
- WebSocket connections for all logged-in players
- Live updates when players take actions
- Turn notifications
- Trade request notifications
- Player join/leave notifications
- Chat messages
- Reconnection handling

### 8. Game State Persistence
- Save complete game state after each action
- Allow players to disconnect and rejoin
- Game history tracking
- Resume game after crashes/server restarts
- Manual game reset option (resets to initial state)

### 9. Win Conditions & Game End
- Bankruptcy detection
- Last player standing wins
- Victory screen with statistics
- Game summary (total money, properties, turns played)
- Reset game option after completion

## PostgreSQL Database Schema

### users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    token_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data for 5 hardcoded users
INSERT INTO users (username, password_hash, token_type) VALUES
('player1', '$2b$10$[hashed_password1]', 'car'),
('player2', '$2b$10$[hashed_password2]', 'hat'),
('player3', '$2b$10$[hashed_password3]', 'dog'),
('player4', '$2b$10$[hashed_password4]', 'ship'),
('player5', '$2b$10$[hashed_password5]', 'thimble');
```

### game Table (Single Row)
```sql
CREATE TABLE game (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    current_turn_user_id INTEGER REFERENCES users(id),
    turn_deadline TIMESTAMP,
    settings JSONB DEFAULT '{"starting_money": 1500, "free_parking_money": 0, "go_salary": 200}'::jsonb
);

-- Single game instance
INSERT INTO game (id, status, started_at) VALUES (1, 'in_progress', CURRENT_TIMESTAMP);
```

### players Table
```sql
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE NOT NULL,
    game_id INTEGER REFERENCES game(id) DEFAULT 1,
    money INTEGER DEFAULT 1500,
    position INTEGER DEFAULT 0, -- 0-39
    is_in_jail BOOLEAN DEFAULT false,
    jail_turns INTEGER DEFAULT 0,
    get_out_of_jail_cards INTEGER DEFAULT 0,
    is_bankrupt BOOLEAN DEFAULT false,
    turn_order INTEGER NOT NULL,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### properties Table
```sql
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES game(id) DEFAULT 1,
    name VARCHAR(100) NOT NULL,
    property_type VARCHAR(20) NOT NULL, -- standard, railroad, utility
    color_group VARCHAR(20),
    position_on_board INTEGER NOT NULL, -- 0-39
    purchase_price INTEGER NOT NULL,
    rent_base INTEGER NOT NULL,
    rent_values JSONB, -- Array of rent values for houses/hotel
    house_cost INTEGER,
    mortgage_value INTEGER NOT NULL,
    owner_id INTEGER REFERENCES players(id),
    is_mortgaged BOOLEAN DEFAULT false,
    house_count INTEGER DEFAULT 0, -- 0-5, where 5 = hotel
    UNIQUE(game_id, position_on_board)
);
```

### trades Table
```sql
CREATE TABLE trades (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES game(id) DEFAULT 1,
    proposer_id INTEGER REFERENCES players(id) NOT NULL,
    recipient_id INTEGER REFERENCES players(id) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, countered
    offered_properties JSONB DEFAULT '[]'::jsonb, -- Array of property IDs
    offered_money INTEGER DEFAULT 0,
    offered_jail_cards INTEGER DEFAULT 0,
    requested_properties JSONB DEFAULT '[]'::jsonb, -- Array of property IDs
    requested_money INTEGER DEFAULT 0,
    requested_jail_cards INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### game_actions Table (History/Audit Log)
```sql
CREATE TABLE game_actions (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES game(id) DEFAULT 1,
    player_id INTEGER REFERENCES players(id),
    action_type VARCHAR(50) NOT NULL, -- roll, buy_property, build, trade, pay_rent, etc.
    action_data JSONB, -- Flexible JSON for action-specific data
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient history queries
CREATE INDEX idx_game_actions_timestamp ON game_actions(game_id, timestamp DESC);
CREATE INDEX idx_game_actions_player ON game_actions(player_id, timestamp DESC);
```

### game_chat Table
```sql
CREATE TABLE game_chat (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES game(id) DEFAULT 1,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_game_chat_timestamp ON game_chat(game_id, timestamp DESC);
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/verify` - Verify JWT token validity

### Game State
- `GET /api/game` - Get current game state
- `POST /api/game/reset` - Reset game to initial state (requires confirmation)
- `GET /api/game/history` - Get game action history

### Player Actions
- `POST /api/game/roll` - Roll dice for current player
- `POST /api/game/buy-property` - Purchase current property
- `POST /api/game/build` - Build house/hotel
- `POST /api/game/mortgage` - Mortgage/unmortgage property
- `POST /api/game/end-turn` - End current turn

### Trading
- `POST /api/trades/propose` - Propose a trade
- `POST /api/trades/:id/accept` - Accept a trade
- `POST /api/trades/:id/reject` - Reject a trade
- `POST /api/trades/:id/counter` - Counter a trade
- `GET /api/trades` - Get active trades

### Chat
- `GET /api/chat/messages` - Get chat history
- `POST /api/chat/send` - Send chat message

### WebSocket Events
- `game:state-update` - Broadcast game state changes
- `player:turn-start` - Notify player their turn started
- `trade:proposed` - Notify player of trade proposal
- `chat:message` - Broadcast chat message
- `player:connected` - Player joined
- `player:disconnected` - Player left

## 3D Asset Requirements

### Board Elements
- Board base/platform
- Property spaces (40 total)
- Corner decorations
- Houses (3D models, color-coded)
- Hotels (3D models, color-coded)
- Chance/Community Chest card stacks
- Railroad stations
- Utility buildings

### Player Tokens (5 Total)
- Car
- Hat
- Dog
- Ship
- Thimble

### Cards
- Chance card template (3D card model)
- Community Chest card template (3D card model)
- Property deed cards (2D overlay or 3D pop-up)

### Dice
- Two 6-sided dice with realistic physics
- High-quality textures

### Effects
- Particle effects for dice rolls
- Confetti/celebration effects for wins
- Visual feedback for purchases
- Glow effects for owned properties

## Performance Requirements
- 60 FPS for 3D rendering on mid-range devices
- Load time under 5 seconds
- Smooth animations (no jank)
- Responsive on desktop, tablet, and mobile (mobile with touch controls)
- Handle 5 simultaneous players without lag

## Security Requirements
- Bcrypt for password hashing (rounds: 10)
- JWT token validation on all protected endpoints
- Rate limiting on login endpoint (5 attempts per 15 minutes)
- Input validation and sanitization
- Prevent cheating (server-side game logic validation)
- WebSocket message validation
- SQL injection prevention (parameterized queries)
- XSS protection

## Testing Requirements
- Unit tests for game logic functions
- Integration tests for API endpoints
- E2E tests for critical user flows
- Load testing for 5 simultaneous players
- Cross-browser testing

## Development Phases

### Phase 1: Foundation (Weeks 1-2)
- Set up React project with Three.js
- PostgreSQL database setup and schema
- Hardcoded user authentication system
- Basic 3D board rendering
- Camera controls
- Player token movement

### Phase 2: Core Gameplay (Weeks 3-4)
- Dice rolling mechanics
- Property purchase system
- Turn management
- Basic UI components
- WebSocket integration
- Single game instance logic

### Phase 3: Full Game Rules (Weeks 5-6)
- Building houses/hotels
- Rent calculation
- Chance/Community Chest
- Jail mechanics
- Bankruptcy detection

### Phase 4: Multiplayer Features (Weeks 7-8)
- Trading system
- Real-time updates for all 5 players
- Chat system
- Game reset functionality

### Phase 5: Polish & Testing (Weeks 9-10)
- 3D asset refinement
- Animations and effects
- Sound design
- Bug fixes
- Performance optimization
- User testing with 5 players

### Phase 6: Deployment (Week 11)
- Production deployment
- Monitoring setup
- Documentation
- Launch

## Game Reset Functionality
- Any logged-in player can reset the game
- Requires confirmation modal ("Are you sure? This will reset all progress.")
- Resets all players to starting state:
  - $1500 each
  - Position 0 (GO)
  - No properties owned
  - No houses/hotels
  - Clear all trades
- Clears game history (optional: keep for records)
- Retains chat history (optional)
- Notifies all connected players of reset

## Success Metrics
- Game completion rate
- Average game duration
- Player session length
- Trade frequency
- Bug reports

## Technical Constraints
- Must work in modern browsers (Chrome, Firefox, Safari, Edge)
- No Flash or deprecated technologies
- Mobile responsive design
- Single game instance only - no scalability required
- 5 concurrent users maximum

## Documentation Requirements
- API documentation (Swagger/OpenAPI)
- Component documentation (Storybook)
- Database schema documentation
- Deployment guide
- User manual (for the 5 players)
- Developer setup guide
- README with hardcoded credentials (for development only)