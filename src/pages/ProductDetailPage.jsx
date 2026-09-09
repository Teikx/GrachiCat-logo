import { useState, ViewTransition } from 'react';
import { ArrowLeft, ArrowUpRight, ChevronRight, Gift, Heart, MessageCircle, Minus, Plus, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { money } from '../data/products';
import { Link } from '../navigation/Router';
import PageTransition from '../components/PageTransition';
import WhatsAppIcon from '../components/WhatsAppIcon';

export default function ProductDetailPage({ product, favorite, onFavorite, onAdd, onContact }) {
  const [quantity, setQuantity] = useState(1);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!product) return <PageTransition><main className="shell catalog-empty"><h1 tabIndex={-1}>Este amigurumi no está en el catálogo.</h1><p>Encuentra otro pequeño compañero entre nuestros diseños.</p><Link className="button primary" href="/catalogo">Volver al catálogo <ArrowLeft size={17}/></Link></main></PageTransition>;

  const photos = product.gallery?.length ? product.gallery : [product.image];
  return <PageTransition><main className="detail-page shell">
    <nav className="detail-breadcrumb" aria-label="Ruta del producto"><Link href="/catalogo"><ArrowLeft size={13}/> Catálogo</Link><ChevronRight size={12}/><Link href={`/catalogo?categoria=${encodeURIComponent(product.category)}`}>{product.category}</Link><ChevronRight size={12}/><span aria-current="page">{product.name}</span></nav>
    <div className="detail-layout">
      <section className="detail-gallery" aria-label={`Fotografías de ${product.name}`}>
        <div className="detail-photo">
          <ViewTransition name={`product-photo-${product.id}`} default="none" share="product-photo-morph"><img src={`/imagenes/${photos[photoIndex]}`} alt={`${product.name}, ${photoIndex === 0 ? 'vista principal' : 'foto de ambientación'}`} width="896" height="1195" fetchPriority="high"/></ViewTransition>
          <span className="detail-photo-tag"><Heart size={13}/> Tejido con mucho cariño</span>
          {photos.length > 1 && <div className="detail-thumbnails" aria-label="Elegir fotografía">{photos.map((photo, index) => <button key={photo} aria-label={`Ver foto ${index + 1} de ${product.name}`} aria-pressed={photoIndex === index} onClick={() => setPhotoIndex(index)}><img src={`/imagenes/${photo}`} alt="" width="56" height="65"/></button>)}</div>}
        </div>
        <p className="detail-photo-note"><Sparkles size={14}/> Cada puntada hace que el tuyo sea único.</p>
      </section>
      <section className="detail-info" aria-labelledby="product-title">
        <span className="eyebrow">PEQUEÑOS DETALLES, GRANDES SONRISAS</span>
        <div className="detail-title-row"><h1 id="product-title" tabIndex={-1}>{product.name}</h1><button className={`icon-button detail-favorite ${favorite ? 'selected' : ''}`} aria-label={`${favorite ? 'Quitar' : 'Guardar'} ${product.name} ${favorite ? 'de' : 'en'} favoritos`} aria-pressed={favorite} onClick={() => onFavorite(product.id)}><Heart size={22} fill={favorite ? 'currentColor' : 'none'}/></button></div>
        <p className="detail-price">{money(product.price)} <span>por amigurumi</span></p>
        <p className="detail-subtitle">{product.subtitle} <Heart size={13}/></p>
        <p className="detail-description">{product.description}</p>
        <ul className="detail-features"><li><Heart size={17}/><span>Hecho a mano, punto a punto</span></li><li><Gift size={17}/><span>Un detalle para regalar o regalarte</span></li><li><MessageCircle size={17}/><span>Consulta medidas y disponibilidad por WhatsApp</span></li></ul>
        <div className="detail-purchase">
          <div className="detail-quantity-row"><div><span className="detail-field-label">Cantidad</span><div className="detail-quantity"><button disabled={quantity === 1} aria-label="Reducir cantidad" onClick={() => setQuantity(value => Math.max(1, value - 1))}><Minus size={16}/></button><output aria-label="Cantidad seleccionada" aria-live="polite">{quantity}</output><button disabled={quantity === 99} aria-label="Aumentar cantidad" onClick={() => setQuantity(value => Math.min(99, value + 1))}><Plus size={16}/></button></div></div><p className="detail-subtotal"><span>Subtotal</span><strong>{money(product.price * quantity)}</strong></p></div>
          <button className="button primary detail-add" onClick={() => onAdd(product.id, quantity)}><ShoppingBag size={19}/> Añadir al carrito <span>{money(product.price * quantity)}</span></button>
          <button className="button whatsapp detail-question whatsapp-cta" onClick={() => onContact(`¡Hola, GrachiGurumis! Me interesa ${product.name} (${money(product.price)}). ¿Me confirman sus medidas, disponibilidad y tiempo de entrega?`)}><WhatsAppIcon size={19}/> Consultar por WhatsApp <ArrowUpRight size={17}/></button>
          <p className="detail-purchase-note">Coordinamos contigo el envío y el pago antes de confirmar tu pedido.</p>
        </div>
      </section>
    </div>
    <section className="detail-benefits" aria-label="Detalles que acompañan tu pedido"><div><Truck size={25} strokeWidth={1.4}/><p><strong>Envíos a todo el Perú</strong><span>Coordinamos la entrega contigo</span></p></div><div><MessageCircle size={25} strokeWidth={1.4}/><p><strong>Atención de cerca</strong><span>Resolvemos tus dudas por WhatsApp</span></p></div><div><Gift size={25} strokeWidth={1.4}/><p><strong>Un regalo especial</strong><span>Hecho con amor, para alguien único</span></p></div></section>
    <div className="detail-bottom"><span className="handwritten">Un poquito de hilo. Muchísimo amor. ♡</span><Link href="/catalogo">Seguir explorando <ChevronRight size={15}/></Link></div>
  </main></PageTransition>;
}
