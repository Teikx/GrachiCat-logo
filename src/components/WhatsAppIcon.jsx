import whatsAppLogo from '../../logos/whatsapp.svg';

export default function WhatsAppIcon({ size = 20, className = '', style, ...props }) {
  return (
    <img
      src={whatsAppLogo}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`whatsapp-icon ${className}`.trim()}
      style={{ width: 'auto', height: size, ...style }}
      {...props}
    />
  );
}
