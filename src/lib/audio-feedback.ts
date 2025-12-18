/**
 * Audio Feedback Module
 * Plays sound effects from public/sounds/ for quiz interactions.
 */

const CORRECT_SOUNDS = [
  '/sounds/correct-1.mp3',
  '/sounds/correct-2.mp3',
  '/sounds/correct-3.mp3',
  '/sounds/correct-4.mp3',
  '/sounds/correct-5.mp3',
];

export function playCorrect(): void {
  const src = CORRECT_SOUNDS[Math.floor(Math.random() * CORRECT_SOUNDS.length)];
  new Audio(src).play().catch(() => {});
}

export function playIncorrect(): void {
  new Audio('/sounds/incorrect.mp3').play().catch(() => {});
}
