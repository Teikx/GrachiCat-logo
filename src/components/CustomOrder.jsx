import { ArrowUpRight, Gift, Heart, Sparkles } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

const ideas = [
  { icon: Gift, label: 'Un regalo con historia' },
  { icon: Sparkles, label: 'Tu personaje favorito' },
  { icon: Heart, label: 'Un detalle muy tuyo' },
];

export default function CustomOrder({ onContact }) {
  return (
    <section className="contact-section shell" aria-labelledby="custom-order-title">
      <div className="custom-invitation">
        <div className="custom-visual">
          <img src="/imagenes/oso-imagen.webp" alt="Osito tejido a mano abrazando un ramo de rosas de crochet" loading="lazy" width="896" height="1195" />
          <span className="custom-photo-label"><Heart size={13} strokeWidth={1.6} aria-hidden="true" /></span>
          <div className="custom-photo-caption"><span className="handwritten">Hay regalos que dicen mucho sin decir nada.</span><Heart size={23} strokeWidth={1.3} aria-hidden="true" /></div>
        </div>
        <div className="custom-copy">
          <h2 id="custom-order-title" tabIndex={-1}>¿Tienes una idea<br/><em>especial?</em></h2>
          <p>Cuéntanos para quién es y qué te gustaría crear.</p>
          <ul className="custom-ideas" aria-label="Ideas para tu pedido">{ideas.map(({ icon: Icon, label }) => <li key={label}><Icon size={16} strokeWidth={1.6} aria-hidden="true" />{label}</li>)}</ul>
          <button className="button whatsapp custom-whatsapp whatsapp-cta" onClick={() => onContact('¡Hola, GrachiGurumis! Me gustaría crear un amigurumi personalizado. ¿Me ayudan a darle forma a mi idea?')}><WhatsAppIcon size={20} /> Escríbenos por WhatsApp <ArrowUpRight size={19} aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  );
}
