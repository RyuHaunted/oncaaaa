// Código inicial para a versão vanilla do site
document.addEventListener('DOMContentLoaded', () => {
  // Popular o Puzzle 1 com tiles de exemplo
  const grid = document.querySelector('#puzzle1 .puzzle-grid');
  if (grid) {
    for (let i = 0; i < 12; i++) {
      const t = document.createElement('div');
      t.className = 'tile';
      t.textContent = i + 1;
      grid.appendChild(t);
    }
  }

  // Exemplo simples de interação para Puzzle 2
  const p2 = document.querySelector('#puzzle2 .puzzle-content');
  if (p2) p2.textContent = 'Clique para desbloquear';
  if (p2) p2.addEventListener('click', () => alert('Puzzle 2: interação de exemplo'));
});