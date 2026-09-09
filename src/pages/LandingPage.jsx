import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight, Heart, Scissors, Sparkles } from 'lucide-react';
import CustomOrder from '../components/CustomOrder';
import ProductCard from '../components/ProductCard';
import PageTransition from '../components/PageTransition';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { Link } from '../navigation/Router';

export default function LandingPage({ reveal, contact, benefits, position, track, reduced, filter, selectFilter, visible, favorites, favorite, add }) {
  return <PageTransition>
    <main className="landing-page">
      <section id="inicio" className="hero"><img className="hero-image" src="/imagenes/pato_header.webp" alt="Pollito amigurumi amarillo con un globo de corazón tejido, sobre una manta rosa" fetchPriority="high"/><div className="hero-shade"/><div className="shell hero-inner"><motion.div {...reveal} className="hero-copy"><h1 tabIndex={-1}>Amigurumis que<br/><em>alegran</em> tu mundo<span className="title-heart">♡</span></h1><p>Hay regalos que se abrazan con el corazón.<br className="desktop-break"/> Descubre pequeños compañeros tejidos con amor,<br className="desktop-break"/> para hacer extraordinarios tus días.</p><div className="hero-buttons"><Link className="button primary" href="/catalogo">Ver catálogo <ArrowUpRight size={19}/></Link><button className="button whatsapp hero-whatsapp" onClick={() => contact()}><WhatsAppIcon size={19}/> Escríbenos por WhatsApp</button></div><div className="hero-note"><span className="tiny-heart"><Heart size={16}/></span><span>Un poquito de hilo. Muchísimo amor.</span></div></motion.div></div><span className="handwritten hero-scribble">Tu próximo<br/>abrazo favorito <svg viewBox="0 0 95 52"><path d="M86 8 C 55 6, 30 18, 7 34 M 16 23 L 7 34 L 21 35"/></svg></span><svg className="wave" viewBox="0 0 1440 50" preserveAspectRatio="none"><path d="M0 22C250 70 460-5 720 24s460 29 720-6V50H0Z"/></svg></section>
      <section className="benefits shell" aria-label="Por qué elegir GrachiGurumis">{benefits.map(({ icon: Icon, title, text }) => <div className="benefit" key={title}><div className="benefit-icon"><Icon size={23} strokeWidth={1.5}/></div><div><h2>{title}</h2><p>{text}</p></div></div>)}</section>
      <section id="catalogo" className="catalog shell"><motion.div {...reveal} className="section-heading"><div><span className="eyebrow">PEQUEÑOS COMPAÑEROS, GRANDES HISTORIAS</span><h2>Destacados de la Semana <Sparkles className="heading-sparkle" size={26}/></h2></div><div className="carousel-controls"><button className="icon-button circle" aria-label="Productos anteriores" disabled={position.start} onClick={() => track.current.scrollBy({ left: -track.current.clientWidth, behavior: reduced ? 'instant' : 'smooth' })}><ChevronLeft size={20}/></button><button className="icon-button circle" aria-label="Productos siguientes" disabled={position.end} onClick={() => track.current.scrollBy({ left: track.current.clientWidth, behavior: reduced ? 'instant' : 'smooth' })}><ChevronRight size={20}/></button></div></motion.div>
        <div className="filters" aria-label="Filtrar catálogo">{['Todos', 'Animalitos', 'Personajes', 'Favoritos'].map(name => <button key={name} aria-pressed={filter === name} className={filter === name ? 'active' : ''} onClick={event => selectFilter(name, event)}>{name === 'Favoritos' && <Heart size={13}/>} {name}</button>)}</div>
        <div ref={track} className="product-track" tabIndex="0" role="region" aria-label="Carrusel de productos">{visible.map(product => <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} onFavorite={favorite} onAdd={add}/>)}{!visible.length && <div className="empty-favorites"><Heart size={30}/><h3>Aquí empieza una bonita colección</h3><p>Toca el corazón de los amigurumis que más te gusten.</p><button className="text-link" onClick={event => selectFilter('Todos', event)}>Explorar amigurumis <ArrowRight size={16}/></button></div>}</div>
        <div className="catalog-bottom"><span><Scissors size={16}/> Cada pieza es única, como la persona que la recibe.</span><Link className="text-link" href="/catalogo">Ver catálogo completo <ArrowRight size={17}/></Link></div>
      </section>
      <div id="contacto" className="contact-area">
        <section id="nosotros" className="story-strip"><div className="shell"><Heart size={25} strokeWidth={1.3}/><p>No son solo amigurumis. Son <em>cariño que puedes abrazar.</em></p></div></section>
        <CustomOrder onContact={contact} />
      </div>
    </main>
  </PageTransition>;
}
