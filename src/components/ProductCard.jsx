import { ViewTransition } from 'react';
import { Heart, Plus } from 'lucide-react';
import { Link } from '../navigation/Router';
import { money } from '../data/products';
export default function ProductCard({ product, favorite, onFavorite, onAdd }) {
  return <article className="product-card">
    <div className="product-photo"><Link className="product-detail-link" href={`/producto/${product.id}`} aria-label={`Ver detalles de ${product.name}`}><ViewTransition name={`product-photo-${product.id}`} default="none" share="product-photo-morph"><img src={`/imagenes/${product.image}`} alt={product.name + ', amigurumi tejido a mano'} loading="lazy" width="896" height="1195"/></ViewTransition></Link>
      {product.tag && <span className="product-tag">{product.tag}</span>}
      <button className={`favorite icon-button ${favorite ? 'selected' : ''}`} onClick={() => onFavorite(product.id)} aria-label={`${favorite ? 'Quitar' : 'Guardar'} ${product.name} ${favorite ? 'de' : 'en'} favoritos`} aria-pressed={favorite}><Heart size={19} fill={favorite ? 'currentColor' : 'none'}/></button>
    </div>
    <div className="product-info"><span className="product-category">HECHO A MANO · CON AMOR</span><h3><Link href={`/producto/${product.id}`}>{product.name}</Link></h3><p>{product.subtitle}</p><div className="product-bottom"><strong>{money(product.price)}</strong><button className="buy-button" onClick={() => onAdd(product.id)} aria-label={`Añadir ${product.name} al carrito`}><Plus size={16}/> Lo quiero</button></div></div>
  </article>;
}
