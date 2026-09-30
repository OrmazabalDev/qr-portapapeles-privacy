# QRCero — sitio oficial

Sitio estático de QRCero, producto de Ormazabal DEV, publicado mediante GitHub Pages.

**Sitio:** https://ormazabaldev.github.io/qrcero/

## Objetivo

Comunicar una idea simple y comprobable: QRCero genera códigos QR dentro del navegador y no necesita enviar el contenido a servidores externos.

## Archivos

- `index.html`: estructura, contenido y accesibilidad.
- `styles.css`: sistema visual, temas claro/oscuro, responsive y movimiento.
- `app.js`: interacción local, tema, revelado al hacer scroll y demostración visual.
- `privacy.html`: política de privacidad.
- `support.html`: soporte y resolución de problemas.
- `changelog.html`: historial de versiones.
- `assets/brand/`: logotipos, isotipo, iconos y recurso social.

## Privacidad del sitio

- Sin analítica.
- Sin cookies.
- Sin fuentes externas.
- Sin CDN.
- Sin solicitudes a APIs para la demostración.
- La preferencia de tema se guarda solamente en `localStorage`.

## Publicación

El workflow `.github/workflows/pages.yml` publica automáticamente la raíz del repositorio después de cada push a `main`. El sitio no requiere compilación, dependencias ni servicios externos.

## Versión del producto

El sitio documenta QRCero 2.1.0. La extensión continúa generando códigos localmente y mantiene los mismos permisos de la versión 2.0.4.
