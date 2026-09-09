import { startTransition, useEffect, useState, ViewTransition } from 'react';
import { ArrowRight, Heart, LayoutGrid, PawPrint, Search, SlidersHorizontal, Sparkles, X, MessageCircle } from 'lucide-react';
import { products, money } from '../data/products';
import ProductCard from '../components/ProductCard';
import PageTransition from '../components/PageTransition';
import { Link, useRouter } from '../navigation/Router';

const categories = ['Todos', ...new Set(products.map(product => product.category))];
const categoryIcons = { Todos: LayoutGrid, Animalitos: PawPrint, Personajes: Sparkles };
const priceCeiling = Math.max(50, ...products.map(product => product.price));
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export default function CatalogPage({ favorites, onFavorite, onAdd, onContact }) {
  const { route } = useRouter();
  const [category, setCategory] = useState(() => { const value = new URLSearchParams(route.search).get('categoria'); return categories.includes(value) ? value : 'Todos'; });
  const [query, setQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(priceCeiling);
  const [sort, setSort] = useState('featured');
  const [favoritesOnly, setFavoritesOnly] = useState(() => new URLSearchParams(route.search).has('favoritos'));
  useEffect(() => { setFavoritesOnly(new URLSearchParams(route.search).has('favoritos')); const value = new URLSearchParams(route.search).get('categoria'); setCategory(categories.includes(value) ? value : 'Todos'); }, [route]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtered = products.filter(product =>
    (category === 'Todos' || product.category === category) &&
    (!favoritesOnly || favorites.includes(product.id)) &&
    product.price <= maxPrice &&
    normalize(`${product.name} ${product.subtitle} ${product.category}`).includes(normalize(query))
  ).sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : sort === 'name' ? a.name.localeCompare(b.name, 'es') : products.indexOf(a) - products.indexOf(b));
  const activeCount = Number(category !== 'Todos') + Number(favoritesOnly) + Number(maxPrice < priceCeiling);
  function reset() { setCategory('Todos'); setQuery(''); setMaxPrice(priceCeiling); setFavoritesOnly(false); }
  function changeCategory(value, event) {
    if (event.detail === 0) setCategory(value);
    else startTransition(() => setCategory(value));
  }

  return <PageTransition><main className="catalog-page shell">
    <div className="catalog-breadcrumb"><Link href="/">Inicio</Link><span>/</span><span>Catálogo</span></div>
    <div className="catalog-page-heading"><div><span className="eyebrow">UN PEQUEÑO MUNDO HECHO A MANO</span><h1 tabIndex={-1}>Catálogo <em>de abrazos.</em></h1><p>Amigurumis con personalidad, tejidos para regalar y regalarte.</p></div><span className="catalog-handnote handwritten">Hechos con hilo<br/>y mucho cariño ♡</span></div>
    <div className="catalog-layout">
      <aside className="catalog-sidebar" aria-label="Filtros del catálogo">
        <button className="catalog-filter-toggle" onClick={() => setFiltersOpen(value => !value)} aria-expanded={filtersOpen} aria-controls="catalog-filter-options"><SlidersHorizontal size={17}/> Filtrar productos {activeCount > 0 && <span>{activeCount}</span>} {filtersOpen ? <X size={16}/> : <PlusIndicator/>}</button>
        <div id="catalog-filter-options" className={`catalog-filter-options ${filtersOpen ? 'expanded' : ''}`}>
          <h2>Categorías</h2><div className="catalog-categories">{categories.map(name => { const Icon = categoryIcons[name] || Sparkles; return <button key={name} className={category === name ? 'selected' : ''} aria-pressed={category === name} onClick={event => changeCategory(name, event)}><Icon size={18} strokeWidth={1.6}/><span>{name === 'Animalitos' ? 'Animales' : name}</span><small>{name === 'Todos' ? products.length : products.filter(p => p.category === name).length}</small></button>; })}</div>
          <div className="catalog-price"><label htmlFor="catalog-price-range">Precio máximo <strong>{money(maxPrice)}</strong></label><input id="catalog-price-range" type="range" min="0" max={priceCeiling} step="1" value={maxPrice} onChange={event => setMaxPrice(Number(event.target.value))}/><div><span>S/ 0</span><span>{money(priceCeiling)}</span></div></div>
          <label className="catalog-favorites"><input type="checkbox" checked={favoritesOnly} onChange={event => setFavoritesOnly(event.target.checked)}/><Heart size={16}/> Solo mis favoritos</label>
          {activeCount > 0 && <button className="catalog-reset" onClick={reset}>Limpiar filtros <X size={13}/></button>}
        </div>
        <div className="catalog-custom"><span className="catalog-custom-icon"><MessageCircle size={22} strokeWidth={1.4}/></span><h3>¿Lo imaginaste diferente?</h3><p>También tejemos tus ideas.<br/>Cuéntanos cómo sería el tuyo.</p><button onClick={() => onContact('¡Hola, GrachiGurumis! Estoy viendo el catálogo y me gustaría consultar por un diseño personalizado.')} className="text-link">Hablemos <ArrowRight size={14}/></button></div>
      </aside>
      <section className="catalog-results" aria-label="Productos del catálogo">
        <div className="catalog-toolbar"><div className="catalog-search"><Search size={17} aria-hidden="true"/><label className="sr-only" htmlFor="buscar">Buscar amigurumis</label><input id="buscar" type="search" placeholder="Busca tu amigurumi favorito…" value={query} onChange={event => setQuery(event.target.value)}/></div><label className="catalog-sort"><span>Ordenar por</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Recomendados</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option><option value="name">Nombre: A–Z</option></select></label></div>
        <div className="catalog-result-summary"><h2>{category === 'Todos' ? 'Todos los amigurumis' : category}</h2><span role="status">{filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}</span></div>
        <div className="catalog-grid">{filtered.map(product => <ViewTransition key={product.id} default="none" update="catalog-item" enter="catalog-item" exit="catalog-item"><ProductCard product={product} favorite={favorites.includes(product.id)} onFavorite={onFavorite} onAdd={onAdd}/></ViewTransition>)}</div>
        {!filtered.length && <ViewTransition enter="catalog-item" exit="catalog-item" default="none"><div className="catalog-empty"><Search size={32} strokeWidth={1.3}/><h3>Aún no encontramos ese pequeño compañero</h3><p>Prueba otro nombre, cambia el precio o explora todos nuestros amigurumis.</p><button className="button secondary" onClick={reset}>Ver todos los productos <ArrowRight size={16}/></button></div></ViewTransition>}
        <div className="catalog-endnote"><Heart size={15} strokeWidth={1.5}/><span>Cada pieza tiene algo especial: está hecha a mano, para ti.</span></div>
      </section>
    </div>
  </main></PageTransition>;
}

function PlusIndicator() { return <span aria-hidden="true">+</span>; }
