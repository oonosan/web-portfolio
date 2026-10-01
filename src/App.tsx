import { lazy, Suspense, useEffect, useState } from 'react';
import { useScrollTracking } from './scroll';
import { Header, ProgressRail } from './ui/Header';
import { Chapters } from './ui/Chapters';

const Scene = lazy(() => import('./scene/Scene').then((m) => ({ default: m.Scene })));

/** The room paints text onto canvases, so wait for the web fonts before building it. */
function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const fonts = ['700 30px Nunito', '600 22px Fredoka', '500 16px Fredoka'];
    const timeout = new Promise((r) => setTimeout(r, 2500));
    Promise.race([Promise.all(fonts.map((f) => document.fonts.load(f))), timeout])
      .catch(() => undefined)
      .then(() => setReady(true));
  }, []);
  return ready;
}

export function App() {
  useScrollTracking();
  const fontsReady = useFontsReady();

  return (
    <>
      <div className="fixed inset-0 z-0">
        {fontsReady && (
          <Suspense fallback={null}>
            <div className="fade-in h-full w-full">
              <Scene />
            </div>
          </Suspense>
        )}
      </div>
      <Header />
      <ProgressRail />
      <Chapters />
    </>
  );
}
