/**
 * Cryptographic text scramble / character decryption animation
 * Inspired by noth.in (Awwwards Site of the Day / Parisian luxury studio)
 */

const DEFAULT_GLYPHS = '!<>-_\\/[]{}—=+*^?#%&$_01';

export interface ScrambleOptions {
  duration?: number;
  chars?: string;
  onComplete?: () => void;
}

export function scrambleText(
  element: HTMLElement | null,
  finalText: string,
  options?: ScrambleOptions
): () => void {
  if (!element) return () => {};

  const isReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isReduced) {
    element.textContent = finalText;
    options?.onComplete?.();
    return () => {};
  }

  const duration = options?.duration ?? 650;
  const glyphs = options?.chars ?? DEFAULT_GLYPHS;
  const startTime = performance.now();
  let animId: number;

  const update = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    // Cubic ease out for luxurious deceleration
    const eased = 1 - Math.pow(1 - progress, 3);
    const resolvedCount = Math.floor(eased * finalText.length);

    let output = '';
    for (let i = 0; i < finalText.length; i++) {
      const char = finalText[i];
      if (char === ' ' || char === '\n' || char === '/' || char === '(' || char === ')') {
        output += char;
      } else if (i < resolvedCount) {
        output += char;
      } else {
        output += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
    }

    element.textContent = output;

    if (progress < 1) {
      animId = requestAnimationFrame(update);
    } else {
      element.textContent = finalText;
      options?.onComplete?.();
    }
  };

  animId = requestAnimationFrame(update);
  return () => cancelAnimationFrame(animId);
}
