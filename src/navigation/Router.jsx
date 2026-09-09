import { addTransitionType, createContext, startTransition, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

const RouterContext = createContext(null);
function transitionKind(from, to) {
  const fromURL = new URL(from, location.origin);
  const toURL = new URL(to, location.origin);
  const fromPath = fromURL.pathname;
  const toPath = toURL.pathname;
  const landingSections = ['', '#inicio', '#contacto', '#nosotros'];
  if (fromPath === '/' && toPath === '/' && landingSections.includes(fromURL.hash) && landingSections.includes(toURL.hash)) return 'home-contact-scroll';
  const wasDetail = fromPath.startsWith('/producto/');
  const isDetail = toPath.startsWith('/producto/');
  const isHomeCatalogPair = (fromPath === '/' && toPath === '/catalogo') || (fromPath === '/catalogo' && toPath === '/');
  return !wasDetail && isDetail ? 'product-forward' : wasDetail && !isDetail ? 'product-back' : isHomeCatalogPair ? 'home-catalog' : 'page-lateral';
}
const currentLocation = () => ({ pathname: location.pathname.replace(/\/$/, '') || '/', search: location.search, hash: location.hash });

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(currentLocation);
  const positions = useRef(new Map());
  const pendingScroll = useRef(null);
  const pendingBehavior = useRef('instant');
  const lastURL = useRef(location.href);

  function updateRoute(kind) {
    const scrollWithinLanding = kind === 'home-contact-scroll';
    pendingBehavior.current = scrollWithinLanding && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant';
    const update = () => setRoute({ ...currentLocation(), navigated: true });
    // Keep the live landing visible while scrolling; snapshots would freeze it.
    if (scrollWithinLanding) update();
    else startTransition(() => { addTransitionType(kind); update(); });
  }

  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const onPop = () => {
      positions.current.set(lastURL.current, window.scrollY);
      const kind = transitionKind(lastURL.current, location.href);
      lastURL.current = location.href;
      pendingScroll.current = positions.current.get(location.href) ?? 0;
      updateRoute(kind);
    };
    window.addEventListener('popstate', onPop);
    return () => { history.scrollRestoration = previous; window.removeEventListener('popstate', onPop); };
  }, []);

  useLayoutEffect(() => {
    const behavior = pendingBehavior.current;
    let anchor = null;
    try { anchor = route.hash ? document.getElementById(decodeURIComponent(route.hash.slice(1))) : null; } catch { /* Invalid hashes fall back to the page heading. */ }
    if (pendingScroll.current !== null) {
      window.scrollTo({ top: pendingScroll.current, behavior });
    } else if (anchor) {
      anchor.scrollIntoView({ behavior });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
    const focusTarget = ['#contacto', '#nosotros'].includes(route.hash) ? document.getElementById('custom-order-title') : anchor?.matches('input') ? anchor : document.querySelector('main h1');
    focusTarget?.focus({ preventScroll: true });
    pendingScroll.current = null;
    pendingBehavior.current = 'instant';
    document.title = route.pathname.startsWith('/producto/') ? `${document.querySelector('main h1')?.textContent || 'Producto'} · GrachiGurumis` : route.pathname === '/catalogo' ? 'Catálogo · GrachiGurumis' : 'GrachiGurumis · Pequeños detalles, grandes sonrisas';
  }, [route]);

  function navigate(href) {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return;
    const kind = transitionKind(location.href, url.href);
    positions.current.set(location.href, window.scrollY);
    if (url.href !== location.href) history.pushState(null, '', url);
    lastURL.current = url.href;
    pendingScroll.current = null;
    updateRoute(kind);
  }

  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() { return useContext(RouterContext); }

export function Link({ href, onClick, children, ...props }) {
  const { navigate } = useRouter();
  return <a {...props} href={href} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank' || props.download) return;
    event.preventDefault();
    navigate(href);
  }}>{children}</a>;
}
