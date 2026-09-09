import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
export default function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => { const previous = document.activeElement; const dialog = ref.current; dialog.showModal(); const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = overflow; previous?.focus(); }; }, []);
  return <dialog ref={ref} className="modal" aria-label={title} onCancel={onClose} onClick={event => { if (event.target === ref.current) onClose(); }}><div className="modal-inner"><div className="flex items-center justify-between gap-4 mb-6"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Cerrar"><X/></button></div>{children}</div></dialog>;
}
