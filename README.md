# GrachiGurumis

React + Vite + Tailwind CSS. Landing y catálogo con la misma identidad visual, fotografías, favoritos y estado de compra.

## Desarrollo

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## Páginas y datos

- `/`: landing con Hero, beneficios, Destacados de la Semana y pedidos personalizados por WhatsApp.
- `/catalogo`: catálogo con categorías, búsqueda sin distinción de tildes, precio máximo, favoritos, ordenamiento y estado vacío. Cuatro columnas en escritorio amplio y dos en móvil; filtros desplegables en móvil.
- `/catalogo?favoritos=1`: acceso a los favoritos.
- `/#contacto` y `/#nosotros`: enlaces hacia secciones de la landing desde cualquier página.
- Las rutas permiten navegación interna sin recargar, enlaces en nueva pestaña, recarga directa e historial Atrás/Adelante. Al publicar, configurar el hosting para servir `index.html` en rutas de la SPA como `/catalogo` (Vite ya lo hace en desarrollo y preview).

Editar `src/data/products.js` para añadir productos. Cada registro incluye `id` estable y único, `name`, `subtitle`, `price`, `image`, `animation`, `tag`, `category` y `featured`. Las fotografías se guardan en `public/imagenes/`. Todos los productos actuales cuestan S/ 20.

El catálogo muestra todos los registros. La landing muestra los que tienen `featured: true`. Las categorías y sus contadores se derivan de los datos: no se anuncian categorías o productos que todavía no existen.

## React View Transitions

Se fijaron React y React DOM a `19.3.0-canary-8425b691-20260904`, porque `<ViewTransition>` todavía pertenece al canal Canary. Esta API puede cambiar: actualizar ambas versiones juntas y volver a comprobar navegación, historial y preferencias de movimiento.

`package.json` contiene overrides específicos para los peers de React de Framer Motion y Lucide, cuyos rangos estables no incluyen Canary. Se reutiliza una sola copia de React y se mantiene el lockfile reproducible; no se ignoran globalmente las comprobaciones de dependencias.

- `src/navigation/Router.jsx`: enlaces reales y History API. Las actualizaciones de ruta se ejecutan dentro de `startTransition`. React administra las capturas; no hay llamadas manuales a `document.startViewTransition`.
- `src/components/PageTransition.jsx`: límite de transición antes del DOM de cada página, compartido por landing y catálogo. Fundido lateral de 150–200 ms.
- `src/components/ProductCard.jsx`: fotos compartidas con nombres únicos `product-photo-${id}`. No reutilizar esos nombres en otra instancia simultánea, por ejemplo un modal de producto.
- `src/pages/CatalogPage.jsx`: límites con claves por producto para conservar identidad cuando cambian las categorías. Búsqueda, precio y controles por teclado actualizan inmediatamente.
- Cabecera, franja superior, footer y aviso del carrito están aislados; no se añadieron animaciones al flujo de compra.
- Al regresar a la landing por navegación, se evita repetir las entradas de Framer Motion dentro de la transición de página.
- Sin soporte del navegador, las rutas siguen funcionando sin animación. Con `prefers-reduced-motion`, se desactivan las animaciones de las capturas.
- No hay solicitudes asíncronas ni límites Suspense: los datos locales están listos al navegar para permitir que las fotos compartidas se emparejen.

## Pedidos

WhatsApp: **+51 986 190 698**, configurable mediante `VITE_WHATSAPP_NUMBER` en `.env`. El carrito guarda cantidades localmente y prepara un resumen de pedido; no procesa pagos. Se confirma disponibilidad, envío y pago por WhatsApp. Los favoritos también se guardan en el navegador y se comparten entre páginas.
