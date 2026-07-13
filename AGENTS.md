# Pantagruel Research — Guía de publicación

Blog técnico de **Pantagruel Research**, construido con **Astro** (plantilla Astrofy) y desplegado en **GitHub Pages** vía GitHub Actions.

- **Sitio en producción**: https://pantagruel-alpha.github.io/pantagruel-research
- **Repositorio**: `pantagruel-alpha/pantagruel-research` (owner: cuenta de usuario `pantagruel-alpha`)
- **Idioma por defecto**: español, salvo que se pida otra cosa.

---

## Cómo se publica (flujo resumido)

1. Escribe el artículo como Markdown en `src/content/blog/`.
2. Prueba en local con `npm run dev` (o valida con `npm run build`).
3. Haz commit en `develop` y súbelo.
4. Fusiona `develop → main` y haz push de `main`.
5. **El push a `main` dispara GitHub Actions**, que construye el sitio y lo publica en GitHub Pages automáticamente.

> El deploy **solo** ocurre al hacer push a `main`. Trabajar en `develop` no publica nada.

---

## Estructura de un artículo

Cada artículo es un archivo `.md` (o `.mdx`) en `src/content/blog/`. El nombre del archivo no define la URL; la URL (slug) se genera a partir del `title`.

Frontmatter obligatorio y opcional (esquema en `src/content/config.ts`):

```markdown
---
title: "Título del artículo"              # obligatorio — genera el slug/URL
description: "Resumen corto del artículo." # obligatorio
pubDate: "Jul 13 2026"                     # obligatorio — formato "Mmm DD YYYY"
heroImage: "/post_img.webp"                # opcional — ruta bajo public/
badge: "NEW"                               # opcional — etiqueta visual
tags: ["tag1", "tag2"]                     # opcional — deben ser únicos
---

## Contenido en Markdown a partir de aquí
```

Reglas útiles:

- **Imágenes / `heroImage`**: se sirven desde `public/`. Una ruta `"/post_img.webp"` apunta a `public/post_img.webp`.
- **Matemáticas**: el blog **no** tiene plugin de LaTeX. No uses `$$...$$`; escribe las fórmulas en texto o en bloques de código para que no se rendericen rotas.
- **Tags únicos**: el build falla si un artículo repite un tag.

---

## Copia de desarrollo en `docs/`

Cada artículo publicado mantiene una **copia de desarrollo** en `docs/`, con una carpeta por artículo:

```text
docs/
  <slug-del-articulo>/
    <slug-del-articulo>.md      # copia de trabajo del artículo
    <adjuntos...>               # imágenes u otros archivos del artículo
```

Al crear o editar un artículo, actualiza también su carpeta en `docs/`. `docs/` es la superficie estable de trabajo/fuentes; `src/content/blog/` es lo que realmente se publica.

---

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor local de desarrollo
npm run build      # build de producción (valida antes de publicar)
npm run preview    # previsualizar el build
```

---

## Publicar paso a paso (comandos)

```bash
# 1. En develop, con el artículo ya creado y su copia en docs/
git checkout develop
git add src/content/blog/ docs/
git commit -m "content: nuevo artículo <título>"
git push origin develop

# 2. Publicar: fusionar a main y empujar (dispara el deploy)
git checkout main
git merge develop --no-edit
git push origin main
git checkout develop
```

Tras el push a `main`, comprueba la pestaña **Actions** del repo: cuando el workflow **"Deploy to GitHub Pages"** salga en verde, el artículo estará en producción.

---

## Notas de operación

- **GitHub Pages** debe estar en `Settings → Pages → Source: GitHub Actions` (ya configurado). El repo debe ser **público** para que Pages funcione en cuenta personal.
- El sitio se sirve bajo el subpath `/pantagruel-research` (ver `base` en `astro.config.mjs`); si cambia el owner o el nombre del repo, actualiza `site` y `base`.
- Este repo vive localmente en `archived/pantagruel-research`; no confundir con el proyecto `pantagruel-alpha`.
