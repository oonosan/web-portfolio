import { useEffect, useSyncExternalStore } from 'react';
import { chapters, type ChapterId } from './content';

/**
 * Scroll progress expressed in chapters: 0 = hero, 1 = what-i-do, 2.5 = halfway from
 * domains to impact, etc. The scene reads `scroll.progress` every frame, so this is a
 * plain mutable object instead of React state.
 */
export const scroll = {
  progress: 0,
  reducedMotion: false,
};

let tops: number[] = [];
let active = 0;
const listeners = new Set<() => void>();

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function measure() {
  tops = chapters.map((c) => document.getElementById(c.id)?.offsetTop ?? 0);
}

function update() {
  if (!tops.length) return;
  const y = window.scrollY + window.innerHeight * 0.5;
  let i = 0;
  while (i < tops.length - 1 && y >= tops[i + 1]) i++;

  let progress = i;
  if (i < tops.length - 1) {
    const f = (y - tops[i]) / (tops[i + 1] - tops[i]);
    // Hold on the chapter while reading it, then travel as the next chapter arrives.
    progress = i + smoothstep(0.45, 1, f);
  }
  // The last chapter is usually shorter than the viewport, so finish the move at the bottom.
  const atBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 4;
  if (atBottom) progress = tops.length - 1;
  scroll.progress = progress;

  const nextActive = Math.round(progress);
  if (nextActive !== active) {
    active = nextActive;
    listeners.forEach((l) => l());
  }
}

/** Mount once: keeps `scroll.progress` in sync with the page. */
export function useScrollTracking() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    scroll.reducedMotion = motion.matches;
    const onMotion = () => (scroll.reducedMotion = motion.matches);

    const remeasure = () => {
      measure();
      update();
    };
    remeasure();
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', remeasure);
    motion.addEventListener('change', onMotion);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', remeasure);
      motion.removeEventListener('change', onMotion);
    };
  }, []);
}

/** Index of the chapter currently in view. Re-renders only when it changes. */
export function useActiveChapter() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => active,
  );
}

export function goToChapter(id: ChapterId) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: scroll.reducedMotion ? 'auto' : 'smooth', block: 'start' });
}

/** 0 during the day, 1 in the evening (the contact chapter). */
export function eveningAmount() {
  return smoothstep(chapters.length - 2, chapters.length - 1, scroll.progress);
}
