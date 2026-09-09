import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowUpRight, ArrowRight, Menu, X, Truck, Gift, MessageCircle, Minus, Plus, Trash2, Check } from 'lucide-react';
import Modal from './components/Modal';
import CartDrawer from './components/CartDrawer';
import LandingPage from './pages/LandingPage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { Link, useRouter } from './navigation/Router';
import { products, money } from './data/products';

function useSavedState(key, fallback) {
  const [value, setValue] = useState(() => { try { const stored = JSON.parse(localStorage.getItem(key)); return Array.isArray(stored) ? stored : fallback; } catch { return fallback; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be disabled. */ } }, [key, value]);
  return [value, setValue];
}
function Brand() { return <Link className="brand" href="/" aria-label="GrachiGurumis, inicio"><span className="brand-mark"><Heart size={29}/><span>〰</span></span>Grachi<span>Gurumis</span></Link>; }
const benefits = [{ icon: Truck, title: 'Llegamos hasta ti', text: 'Envíos a todo el Perú' }, { icon: Gift, title: 'Listos para regalar', text: 'Sonrisas desde el empaque' }];
const navigationLinks = [['Inicio', '/'], ['Catálogo', '/catalogo'], ['Contacto', '/#contacto']];

export default function App() {
  const { route, navigate } = useRouter();
  const [contactInView, setContactInView] = useState(false);
  const contactActive = route.pathname === '/' && contactInView;
  const footer = useRef(null);
  const header = useRef(null);
  useLayoutEffect(() => {
    const update = () => {
      document.documentElement.style.setProperty('--site-footer-height', `${footer.current.getBoundingClientRect().height}px`);
      document.documentElement.style.setProperty('--site-header-height', `${header.current.getBoundingClientRect().height}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(footer.current);
    observer.observe(header.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const contactSection = route.pathname === '/' ? document.getElementById('contacto') : null;
    if (!contactSection) { setContactInView(false); return; }

    let observer;
    const observeSection = () => {
      observer?.disconnect();
      const headerHeight = header.current.getBoundingClientRect().height;
      // Mark Contacto once it enters the upper third of the usable viewport.
      const activationLine = headerHeight + (window.innerHeight - headerHeight) / 3;
      const bounds = contactSection.getBoundingClientRect();
      setContactInView(bounds.top < activationLine && bounds.bottom > headerHeight);
      observer = new IntersectionObserver(([entry]) => setContactInView(entry.isIntersecting), {
        rootMargin: `-${headerHeight}px 0px -${window.innerHeight - activationLine}px 0px`,
        threshold: 0,
      });
      observer.observe(contactSection);
    };
    observeSection();
    const headerObserver = new ResizeObserver(observeSection);
    headerObserver.observe(header.current);
    window.addEventListener('resize', observeSection);
    return () => {
      observer.disconnect();
      headerObserver.disconnect();
      window.removeEventListener('resize', observeSection);
    };
  }, [route.pathname]);
  const [favorites, setFavorites] = useSavedState('grachi-favorites', []);
  const [cart, setCart] = useSavedState('grachi-cart', []);
  const [modal, setModal] = useState(null), [menu, setMenu] = useState(false), [filter, setFilter] = useState('Todos'), [toast, setToast] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 600px)').matches);
  const [instantMenu, setInstantMenu] = useState(false);
  const menuButton = useRef(null);
  const filterMotion = useRef(false);
  const filterAnimation = useRef(null);
  const [position, setPosition] = useState({ start: true, end: true });
  const track = useRef(null), reduced = useReducedMotion();
  const visible = products.filter(p => p.featured).filter(p => filter === 'Todos' || (filter === 'Favoritos' ? favorites.includes(p.id) : p.category === filter));
  const items = cart.filter(item => products.some(p => p.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0).map(item => ({ ...products.find(p => p.id === item.id), quantity: item.quantity }));
  const count = items.reduce((sum, p) => sum + p.quantity, 0), total = items.reduce((sum, p) => sum + p.price * p.quantity, 0);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 3200); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => { const el = track.current; if (!el) return; const update = () => setPosition({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 }); const observer = new ResizeObserver(update); observer.observe(el); el.addEventListener('scroll', update); update(); return () => { observer.disconnect(); el.removeEventListener('scroll', update); }; }, [filter, favorites, route.pathname]);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 600px)');
    const update = () => { setMobile(query.matches); setMenu(false); };
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    let active = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (!active && y > 34) {
        active = true;
        setScrolled(true);
      } else if (active && y <= 15) {
        active = false;
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useLayoutEffect(() => {
    const element = track.current;
    if (!element) { filterAnimation.current?.cancel(); return; }
    const running = filterAnimation.current;
    const opacity = running?.playState === 'running' ? getComputedStyle(element).opacity : '0';
    running?.cancel();
    // Keep the same track and focus; new results are interactive immediately.
    element.scrollTo({ left: 0, behavior: 'instant' });
    if (filterMotion.current) {
      filterAnimation.current = element.animate([{ opacity }, { opacity: 1 }], {
        duration: reduced ? 80 : 120,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      });
    }
    filterMotion.current = false;
  }, [filter, reduced, route.pathname]);
  useEffect(() => () => filterAnimation.current?.cancel(), []);
  function selectFilter(name, event) {
    filterMotion.current = event.detail > 0 && name !== filter;
    setFilter(name);
  }
  function closeMenu(event) {
    setInstantMenu(event.detail === 0);
    setMenu(false);
    if (mobile) menuButton.current?.focus();
  }
  function favorite(id) { setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]); }
  function add(id, amount = 1) { setCart(current => current.some(p => p.id === id) ? current.map(p => p.id === id ? { ...p, quantity: p.quantity + amount } : p) : [...current, { id, quantity: amount }]); setToast('Un poquito de ternura añadido a tu carrito'); }
  function quantity(id, difference) { setCart(current => current.map(p => p.id === id ? { ...p, quantity: p.quantity + difference } : p).filter(p => p.quantity > 0)); }
  function contact(message = '¡Hola, GrachiGurumis! Quisiera saber más sobre sus amigurumis.') { const number = (import.meta.env.VITE_WHATSAPP_NUMBER || '51986190698').replace(/\D/g, ''); if (!number) { setModal('contact'); return; } window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer'); }
  const reveal = { initial: { opacity: 0, y: reduced ? 0 : 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: .55 } };
  return <>
    <div className="announcement" style={{ viewTransitionName: 'site-announcement' }}><span>Pequeños detalles, grandes sonrisas</span><Heart size={12}/><span>Hechos a mano en Perú</span></div>
    <header ref={header} className={`header ${scrolled ? 'scrolled' : ''}`} style={{ viewTransitionName: 'site-header' }}><div className="shell nav"><Brand/><nav id="main-navigation" className={menu ? 'navigation open' : 'navigation'} data-instant={instantMenu} inert={mobile && !menu} onKeyDown={event => { if (event.key === 'Escape') { setInstantMenu(true); setMenu(false); menuButton.current?.focus(); } }} aria-label="Navegación principal">{navigationLinks.map(([name, href]) => <Link key={href} href={href} aria-current={(href === '/#contacto' ? contactActive : route.pathname === href && !contactActive) ? 'page' : undefined} onClick={closeMenu}>{name}</Link>)}</nav><div className="nav-actions"><button className="icon-button favorites-nav" aria-label="Ver favoritos" onClick={() => { setMenu(false); navigate('/catalogo?favoritos=1'); }}><Heart size={21}/>{favorites.length > 0 && <span className="small-count">{favorites.length}</span>}</button><span className="nav-divider"/><button className="cart-trigger" onClick={() => setModal('cart')} aria-label={`Ver carrito, ${count} productos`}><ShoppingBag size={21}/><span className="cart-count">{count}</span></button><button className="icon-button mobile-menu" ref={menuButton} onClick={event => { setInstantMenu(event.detail === 0); setMenu(current => !current); }} aria-label={menu ? "Cerrar menú" : "Abrir menú"} aria-controls="main-navigation" aria-expanded={menu}>{menu ? <X/> : <Menu/>}</button></div></div></header>
    {route.pathname.startsWith('/producto/')
      ? <ProductDetailPage key={route.pathname} product={products.find(p => route.pathname === `/producto/${p.id}`)} favorite={favorites.includes(route.pathname.split('/')[2])} onFavorite={favorite} onAdd={add} onContact={contact}/>
      : route.pathname === '/catalogo'
      ? <CatalogPage favorites={favorites} onFavorite={favorite} onAdd={add} onContact={contact}/>
      : route.pathname === '/'
        ? <LandingPage reveal={route.navigated ? { ...reveal, initial: false } : reveal} contact={contact} benefits={benefits} position={position} track={track} reduced={reduced} filter={filter} selectFilter={selectFilter} visible={visible} favorites={favorites} favorite={favorite} add={add}/>
        : <main className="shell catalog-empty"><h1 tabIndex={-1}>Esta página no está en nuestro pequeño mundo.</h1><Link className="button primary" href="/">Volver al inicio</Link></main>}

    <footer ref={footer} style={{ viewTransitionName: 'site-footer' }}><div className="shell footer-main"><div><Brand/><p>Amigurumis que alegran tu mundo.</p></div><div className="footer-links">{navigationLinks.map(([name, href]) => <Link key={href} href={href}>{name}</Link>)}</div><span className="handwritten">Gracias por apoyar<br/>lo hecho a mano ♡</span></div></footer>
    {toast && <div className="toast" style={{ viewTransitionName: 'shopping-toast' }} role="status"><Check size={18}/>{toast}<button onClick={() => { setToast(''); setModal('cart'); }}>Ver carrito</button></div>}
    {modal === 'contact' && <Modal title="Estamos preparando algo bonito" onClose={() => setModal(null)}><p className="leading-relaxed">El canal de WhatsApp de la tienda estará disponible pronto. Puedes seguir eligiendo tus favoritos; tu carrito queda guardado en este navegador.</p><button className="button primary mt-6" onClick={() => setModal(null)}>Seguir explorando <ArrowRight size={17}/></button></Modal>}
    {modal === 'cart' && <CartDrawer title="Tu bolsita de cariño" onClose={() => setModal(null)}>{items.length ? <><div className="cart-items">{items.map(p => <div className="cart-item" key={p.id}><img src={`/imagenes/${p.image}`} alt={p.name}/><div><h3>{p.name}</h3><p>{money(p.price)}</p><div className="quantity"><button aria-label={`Reducir cantidad de ${p.name}`} onClick={() => quantity(p.id, -1)}><Minus size={14}/></button><span>{p.quantity}</span><button aria-label={`Aumentar cantidad de ${p.name}`} onClick={() => quantity(p.id, 1)}><Plus size={14}/></button></div></div><button className="icon-button" aria-label={`Eliminar ${p.name}`} onClick={() => setCart(current => current.filter(x => x.id !== p.id))}><Trash2 size={18}/></button></div>)}</div><div className="cart-summary"><div className="cart-total"><span>Subtotal</span><strong>{money(total)}</strong></div><p className="cart-help">Coordinamos disponibilidad, envío y pago contigo por WhatsApp.</p><button className="button whatsapp w-full mt-5" onClick={() => contact(`¡Hola, GrachiGurumis! Quisiera pedir:\n${items.map(p => `• ${p.quantity} × ${p.name}: ${money(p.price * p.quantity)}`).join('\n')}\nSubtotal: ${money(total)}\n¿Me confirman disponibilidad y costo de envío?`)}><MessageCircle size={18}/> Pedir por WhatsApp <ArrowUpRight size={17}/></button></div></> : <div className="empty-cart"><ShoppingBag size={40}/><p>Tu próximo abrazo todavía te está esperando.</p><button className="button primary" onClick={() => { setModal(null); navigate('/catalogo'); }}>Ver catálogo <ArrowRight size={17}/></button></div>}</CartDrawer>}
  </>;
}
