import type { ReactNode } from 'react';
import {
  chapters,
  contactLinks,
  domains,
  experiences,
  hero,
  impact,
  pets,
  pipeline,
  tools,
  whatIDo,
  type ChapterId,
} from '../content';
import { goToChapter } from '../scroll';

function Chapter({
  id,
  dark = false,
  children,
}: {
  id: ChapterId;
  dark?: boolean;
  children: ReactNode;
}) {
  const index = chapters.findIndex((c) => c.id === id);
  const meta = chapters[index];
  return (
    <section id={id} className="chapter" aria-labelledby={`${id}-title`}>
      <div className={`card ${dark ? 'card-dark' : ''}`}>
        {index > 0 && (
          <p
            className={`eyebrow mb-5 flex items-center justify-between gap-4 ${dark ? '!text-paper/60' : ''}`}
          >
            <span>
              {String(index).padStart(2, '0')} — {meta.nav}
            </span>
            <span className="normal-case tracking-normal opacity-80">📍 {meta.prop}</span>
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section id="top" className="chapter flex items-center" aria-labelledby="top-title">
      <div className="card rise">
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          {hero.role}
        </p>
        <h1
          id="top-title"
          className="font-display text-[clamp(2.1rem,4.4vw,3.4rem)] font-medium leading-[1] tracking-[-0.01em]"
        >
          Ambiguous problems, turned into <em className="not-italic text-accent">testable</em>{' '}
          solution concepts.
        </h1>
        <p className="mt-6 leading-relaxed text-ink-soft">{hero.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => goToChapter('what-i-do')}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent"
          >
            Step into the studio
          </button>
          <button
            type="button"
            onClick={() => goToChapter('contact')}
            className="rounded-full border border-ink px-6 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Get in touch
          </button>
        </div>
        <p className="eyebrow mt-8 !normal-case !tracking-normal">
          Scroll to walk through the room · click anything in it (yes, the cats too)
        </p>
      </div>
    </section>
  );
}

function WhatIDo() {
  return (
    <Chapter id="what-i-do">
      <h2 id="what-i-do-title" className="section-title">
        From open-ended brief to a concept people can click, test and defend.
      </h2>
      <ol className="mt-6 flex flex-wrap gap-2" aria-label="Discovery to demo path">
        {pipeline.map((p, i) => (
          <li key={p.step} className="tag" title={p.note}>
            <span className="mr-1.5 font-display text-[0.65rem] text-accent">{i + 1}</span>
            {p.step}
          </li>
        ))}
      </ol>
      <ol className="mt-6">
        {whatIDo.map((item, i) => (
          <li key={item.title} className="flex gap-4 border-t border-line py-4">
            <span className="pt-1 font-display text-xs text-accent">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="font-display text-lg leading-tight">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}

function Domains() {
  return (
    <Chapter id="domains">
      <h2 id="domains-title" className="section-title">
        Industries I've worked across.
      </h2>
      <ul className="mt-6">
        {domains.map((d) => (
          <li key={d.name} className="flex flex-col gap-1 border-t border-line py-4">
            <span className="font-display text-xl tracking-tight">{d.name}</span>
            {d.detail && <span className="eyebrow">{d.detail}</span>}
          </li>
        ))}
      </ul>
    </Chapter>
  );
}

function Impact() {
  return (
    <Chapter id="impact">
      <h2 id="impact-title" className="section-title">
        Work that moved from idea to something leadership could evaluate.
      </h2>
      <ul className="mt-6">
        {impact.map((h, i) => (
          <li key={h.label} className="border-t border-line py-4">
            <span className="font-display text-xs text-accent">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-1 font-display text-xl leading-tight">{h.label}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{h.text}</p>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}

function Toolkit() {
  return (
    <Chapter id="toolkit">
      <h2 id="toolkit-title" className="section-title">
        Tools &amp; methods.
      </h2>
      <ul className="mt-6 flex flex-wrap gap-2.5">
        {tools.map((tool) => (
          <li key={tool} className="tag text-sm">
            {tool}
          </li>
        ))}
      </ul>
    </Chapter>
  );
}

function Background() {
  return (
    <Chapter id="background">
      <h2 id="background-title" className="section-title">
        Built on nearly seven years of shipping software.
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        Before moving into discovery and prototyping I worked as a full stack developer in Angular
        and .NET. That experience is why my concepts respect what engineering can realistically
        build, and why handoffs land cleanly.
      </p>
      {experiences.map((e) => (
        <article key={e.company} className="mt-5 border-t border-line pt-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="font-display text-xl tracking-tight">{e.company}</h3>
            <span className="eyebrow">{e.duration}</span>
          </div>
          <p className="mt-1 text-sm font-medium text-accent">{e.role}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{e.description}</p>
          {(e.responsibilities.length > 0 || e.technologies.length > 0) && (
            <details className="mt-3">
              <summary className="eyebrow cursor-pointer select-none hover:text-accent">
                Responsibilities &amp; stack
              </summary>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
                {e.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {e.technologies.map((t) => (
                  <span key={t} className="tag !py-0.5 !text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </details>
          )}
        </article>
      ))}
    </Chapter>
  );
}

function Crew() {
  return (
    <Chapter id="crew">
      <h2 id="crew-title" className="section-title">
        The studio crew.
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        Nothing ships here without approval from the household QA team. You might spot one of them
        in the background of our meetings. Click any of them in the room to say hi.
      </p>
      <ul className="mt-5">
        {Object.values(pets).map((p) => (
          <li key={p.breed} className="border-t border-line py-3.5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-lg">{p.name}</h3>
              <span className="eyebrow">{p.breed}</span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              <span className="text-ink">{p.spot}.</span> {p.quirk}
            </p>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}

function Contact() {
  return (
    <Chapter id="contact" dark>
      <h2
        id="contact-title"
        className="font-display text-[clamp(1.9rem,3.6vw,2.8rem)] font-medium leading-[1.02] tracking-[-0.01em]"
      >
        Have a fuzzy idea that needs to become something testable?
      </h2>
      <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        {contactLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="group inline-flex items-center gap-2 border-b border-paper/30 pb-1 text-lg transition-colors hover:border-blush hover:text-blush"
            >
              {link.label}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col gap-3 border-t border-paper/15 pt-5 sm:flex-row sm:justify-between">
        <span className="eyebrow !text-paper/50">© 2026 {hero.name}</span>
        <button
          type="button"
          onClick={() => goToChapter('top')}
          className="eyebrow text-left !text-paper/50 hover:!text-paper"
        >
          Back to top ↑
        </button>
      </div>
    </Chapter>
  );
}

export function Chapters() {
  return (
    <main className="pointer-events-none relative z-10">
      <Hero />
      <WhatIDo />
      <Domains />
      <Impact />
      <Toolkit />
      <Background />
      <Crew />
      <Contact />
    </main>
  );
}
