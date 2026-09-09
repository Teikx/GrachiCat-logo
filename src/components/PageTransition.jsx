import { ViewTransition } from 'react';

// The page snapshot contains the surrounding content, while named product
// photos get independent snapshots. Fade the page, never the shared photo group.
const pageClasses = {
  'product-forward': 'product-forward',
  'product-back': 'product-back',
  'home-catalog': 'home-catalog',
  default: 'page-crossfade',
};

export default function PageTransition({ children }) {
  return <ViewTransition name="page-content" default="none" share={pageClasses} enter={pageClasses} exit={pageClasses}>{children}</ViewTransition>;
}
