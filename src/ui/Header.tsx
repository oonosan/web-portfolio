import { useState } from 'react';
import { chapters, hero } from '../content';
import { goToChapter, useActiveChapter } from '../scroll';

export function Header() {
  const active = useActiveChapter();
  const [open, setOpen] = useState(false);
  const night = active === chapters.length - 1;
  const links = chapters.slice(1);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_nav]:pointer-events-auto">
      <div className="mx-auto flex items-center justify-between px-5 py-4 md:px-10">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            goToChapter('top');
          }}
          className={`rounded-full px-4 py-2 font-display text-lg font-medium tracking-tight backdrop-blur transition-colors ${
            night ? 'bg-white/10 text-paper' : 'bg-paper/70 text-ink'
          }`}
        >
          {hero.name}
        </a>

        <nav
          aria-label="Chapters"
          className={`hidden items-center gap-1 rounded-full px-2 py-1.5 backdrop-blur lg:flex ${
            night ? 'bg-white/10' : 'bg-paper/70'
          }`}
        >
          {links.map((c) => {
            const i = chapters.indexOf(c);
            const current = i === active;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                aria-current={current ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  goToChapter(c.id);
                }}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  current
                    ? 'bg-accent text-white'
                    : night
                      ? 'text-paper/75 hover:text-white'
                      : 'text-ink-soft hover:text-accent'
                }`}
              >
                {c.nav}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          className={`eyebrow rounded-full border px-4 py-2 backdrop-blur lg:hidden ${
            night ? 'border-white/20 bg-white/10 !text-paper' : 'border-line bg-paper/70'
          }`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Chapters"
          className="mx-4 rounded-2xl border border-line bg-paper/95 px-5 py-3 backdrop-blur lg:hidden"
        >
          {links.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                goToChapter(c.id);
              }}
              className="block border-b border-line/60 py-3 font-display text-xl last:border-0"
            >
              {c.nav}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/** Dots on the right edge showing where you are in the walk-through. */
export function ProgressRail() {
  const active = useActiveChapter();
  return (
    <nav
      aria-label="Chapter progress"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex"
    >
      {chapters.map((c, i) => (
        <button
          key={c.id}
          type="button"
          onClick={() => goToChapter(c.id)}
          aria-label={c.nav}
          aria-current={i === active ? 'true' : undefined}
          className={`h-2.5 w-2.5 rounded-full border transition-all ${
            i === active
              ? 'scale-125 border-accent bg-accent'
              : 'border-ink-soft/50 bg-paper/60 hover:bg-accent/50'
          }`}
        />
      ))}
    </nav>
  );
}
