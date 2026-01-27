import confetti from 'canvas-confetti';

/**
 * Triggers add-to-cart animation with scale effect and confetti
 */
export function triggerAddToCartAnimation(event: React.MouseEvent<HTMLButtonElement>) {
  const button = event.currentTarget;
  
  // Scale animation
  button.classList.add('scale-95');
  setTimeout(() => {
    button.classList.remove('scale-95');
  }, 150);

  // Confetti effect
  const rect = button.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 50,
    spread: 60,
    origin: { x, y },
    colors: ['#10b981', '#059669', '#047857'], // emerald colors
    gravity: 0.8,
    ticks: 200,
  });
}
