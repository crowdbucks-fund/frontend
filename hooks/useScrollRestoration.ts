import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const scrollPositions = new Map<string, number>();
let currentPathname: string = null!;

if (typeof window !== 'undefined')
  currentPathname = window.location.pathname;

export function useScrollRestoration() {

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    let popState = false;
    window.history.pushState = function (...args) {
      const destLocation = args[2] as string;
      currentPathname = window.location.pathname;
      scrollPositions.set(currentPathname, window.scrollY);
      // console.log('push', currentPathname, window.scrollY)
      currentPathname = destLocation;
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function (...args) {
      const destLocation = args[2] as string;
      if (!popState) {
        currentPathname = window.location.pathname;
        scrollPositions.set(currentPathname, window.scrollY);
        // console.log('replace', currentPathname, window.scrollY)
      } else {
        popState = false;
      }
      currentPathname = destLocation;
      return originalReplaceState.apply(this, args);
    };

    const onPopState = () => {
      // console.log('popstate', currentPathname, window.scrollY)
      scrollPositions.set(currentPathname, window.scrollY);
      popState = true;
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    }
  }, []);

  const pathname = usePathname()
  useEffect(() => {
    const y = scrollPositions.get(pathname);
    if (y !== undefined) {
      // console.log('scrolling to', y)
      window.scrollTo(0, y);
      scrollPositions.delete(pathname)
    }
  }, [pathname]);
}
