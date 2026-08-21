# Publicación de Pantagruel Research

## Superficies y fuentes de verdad

`docs/` es la fuente editorial canónica. Cada artículo vive en una única
carpeta `docs/YYYY-MM-DD-<slug>/`, que contiene un Markdown con el mismo nombre
y sus adjuntos. `scripts/sync-articles.mjs` genera la colección que consume
Astro y los adjuntos públicos; no se editan manualmente `src/content/blog/` ni
`public/articles/`.

`develop` sirve exclusivamente para preparar y revisar en local. `main` es la
única rama de producción y GitHub Pages solo se despliega tras fusionar una pull
request de `develop` a `main`.

## Desarrollo del artículo

1. Crear una issue documental y una rama
   `article/<issue-number>-<short-kebab-name>` desde `develop`.
2. Añadir o modificar solo la carpeta canónica de ese artículo en `docs/`.
3. Ejecutar `npm test` y `npm run build` antes de integrar la rama en
   `develop`.
4. En `develop`, ejecutar `npm run preview -- --host 127.0.0.1` y revisar la
   URL local exacta del artículo. Esta revisión no publica contenido en
   Internet.

## Pull request, CI y producción

1. Abrir una pull request con origen `develop` y destino `main`.
2. GitHub Actions instala dependencias, ejecuta las pruebas de publicación y
   construye Astro para cada actualización de esa pull request.
3. Revisar y aprobar el contenido de la preview vigente. Si cambia el artículo,
   repetir la validación y la aprobación.
4. Fusionar la pull request. Solo una PR fusionada de `develop` a `main`
   habilita el despliegue de GitHub Pages.
5. Esperar a que `Deploy to GitHub Pages` termine correctamente y comprobar la
   URL pública exacta:
   `https://pantagruel-alpha.github.io/pantagruel-research/blog/<slug>/`.

Una PR cerrada sin fusionar, una PR con otras ramas o un push directo a `main`
no despliegan el blog.

## Difusión en redes

LinkedIn y X son pasos posteriores, opcionales e independientes del despliegue.
Antes de preparar cualquier anuncio hay que comprobar que la URL pública
corresponde al artículo canónico. Cada anuncio usa exactamente una imagen con
texto alternativo factual, incluye la URL verificada y exige una confirmación
final específica justo antes de publicarse. Las skills locales de cada red
definen el procedimiento detallado.
