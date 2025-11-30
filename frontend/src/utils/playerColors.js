/**
 * Get player color based on turn order
 */
export function getPlayerColor(turnOrder) {
  const colors = ['#E63946', '#1D3557', '#2A9D8F', '#F4A261', '#9D4EDD', '#FF6B35'];
  const colorNames = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

  const index = (turnOrder - 1) % colors.length;
  return {
    hex: colors[index],
    name: colorNames[index]
  };
}

/**
 * Get all player color options
 */
export function getAllPlayerColors() {
  return [
    { hex: '#E63946', name: 'red' },
    { hex: '#1D3557', name: 'blue' },
    { hex: '#2A9D8F', name: 'green' },
    { hex: '#F4A261', name: 'yellow' },
    { hex: '#9D4EDD', name: 'purple' },
    { hex: '#FF6B35', name: 'orange' }
  ];
}
