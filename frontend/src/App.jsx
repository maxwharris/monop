import { useEffect } from 'react';
import useGameStore from './store/gameStore';
import Login from './components/Login';
import Lobby from './components/Lobby';
import Game from './components/Game';

function App() {
  const { user, game, initialize } = useGameStore();

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Show login if no user
  if (!user) {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }

  // Show lobby if game is in lobby status
  if (game?.status === 'lobby') {
    return (
      <div className="App">
        <Lobby />
      </div>
    );
  }

  // Show game if game is in progress
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
