import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export default function CartDrawer({ title, children, onClose }) {
  const ref = useRef(null);
  const closeTimer = useRef(null);
  const openFrame = useRef(null);
  const [opened, setOpened] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    openFrame.current = requestAnimationFrame(() => setOpened(true));
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(closeTimer.current);
      cancelAnimationFrame(openFrame.current);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  function dismiss() {
    if (closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(onClose, 320);
  }

  return <dialog ref={ref} className="cart-drawer" aria-label={title} onCancel={event => { event.preventDefault(); dismiss(); }} onClick={event => { if (event.target === ref.current) dismiss(); }} data-state={closing ? 'closing' : opened ? 'open' : 'closed'}>
    <section className="cart-drawer-panel">
      <header className="cart-drawer-header"><div><span className="eyebrow">TU SELECCIÓN</span><h2>{title}</h2></div><button className="icon-button" onClick={dismiss} aria-label="Cerrar carrito"><X /></button></header>
      <div className="cart-drawer-content">{children}</div>
    </section>
  </dialog>;
}
