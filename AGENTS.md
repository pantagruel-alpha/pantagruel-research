# Pantagruel Research — Guía de publicación

Blog técnico de **Pantagruel Research**, construido con **Astro** (plantilla Astrofy) y desplegado en **GitHub Pages** vía GitHub Actions.

- **Sitio en producción**: https://pantagruel-alpha.github.io/pantagruel-research
- **Repositorio**: `pantagruel-alpha/pantagruel-research` (owner: cuenta de usuario `pantagruel-alpha`)
- **Idioma por defecto**: español, salvo que se pida otra cosa.

---

## Modelo de trabajo (importante)

El trabajo editorial se hace en **`docs/`**, no directamente en `src/content/blog/`.

- **Redacción y desarrollo**: cada artículo se escribe y evoluciona en su carpeta dentro de `docs/`.
- **Publicación bajo demanda**: los artículos **no se publican solos**. Solo cuando se solicita explícitamente se toma un artículo concreto de `docs/`, se lleva a `src/content/blog/` y se despliega. Al pedir la publicación **hay que indicar qué artículo** de `docs/` se publica.

Es decir: `docs/` es el taller (fuente de verdad del contenido en desarrollo); `src/content/blog/` es el escaparate (lo que realmente se sirve en la web).

---

## Estructura de `docs/`

Una carpeta por artículo. **El nombre de la carpeta empieza por la fecha de desarrollo** (`YYYY-MM-DD`) para poder ordenar los artículos cronológicamente:

```text
docs/
  YYYY-MM-DD-<slug>/
    YYYY-MM-DD-<slug>.md     # documento del artículo (con su frontmatter)
    <adjuntos...>            # imágenes u otros archivos del artículo
```

Ejemplo real:

```text
docs/
  2026-03-22-welcome-to-pantagruel-research/
    2026-03-22-welcome-to-pantagruel-research.md
    post_img.webp
  2026-07-13-perceptron-rosenblatt/
    2026-07-13-perceptron-rosenblatt.md
    post_img.webp
```

- La **fecha del prefijo** es la fecha de desarrollo del artículo (normalmente coincide con `pubDate`).
- El documento Markdown dentro de la carpeta lleva el **mismo nombre que la carpeta**.
- Los **adjuntos** (imágenes, etc.) viven junto al Markdown en su carpeta.

---

## Frontmatter del artículo

El Markdown en `docs/` ya incluye el frontmatter que usará al publicarse (esquema en `src/content/config.ts`):

```markdown
---
title: "Título del artículo"              # obligatorio — genera el slug/URL de la web
description: "Resumen corto del artículo." # obligatorio
pubDate: "Jul 13 2026"                     # obligatorio — formato "Mmm DD YYYY"
heroImage: "/post_img.webp"                # opcional — ruta bajo public/
badge: "NEW"                               # opcional — etiqueta visual
tags: ["tag1", "tag2"]                     # opcional — deben ser únicos
---

## Contenido en Markdown a partir de aquí
```

Reglas útiles:

- **Imágenes / `heroImage`**: en la web se sirven desde `public/`. Una ruta `"/post_img.webp"` apunta a `public/post_img.webp`. Si un artículo usa una imagen propia, súbela también a `public/` al publicar.
- **Matemáticas**: el blog **no** tiene plugin de LaTeX. No uses `$$...$$`; escribe las fórmulas en texto o en bloques de código para que no se rendericen rotas.
- **Tags únicos**: el build falla si un artículo repite un tag.

---

## Publicar un artículo (bajo demanda)

Cuando se solicite publicar, indicando **qué artículo** de `docs/` se publica:

1. Copia el Markdown del artículo desde su carpeta en `docs/` a `src/content/blog/<slug>.md`.
   - El `<slug>` del archivo publicado puede omitir el prefijo de fecha (la fecha ya va en `pubDate`).
2. Copia a `public/` los adjuntos que el artículo referencie (p. ej. `heroImage`).
3. Valida con `npm run build`.
4. Commit en `develop` y push.
5. Fusiona `develop → main` y haz push de `main`. **El push a `main` dispara el deploy.**

```bash
# 1. Publicar el artículo <slug> desde docs/
git checkout develop
cp docs/YYYY-MM-DD-<slug>/YYYY-MM-DD-<slug>.md src/content/blog/<slug>.md
# (copia también sus adjuntos a public/ si hace falta)

# 2. Validar y commitear
npm run build
git add src/content/blog/ public/
git commit -m "content: publicar <título>"
git push origin develop

# 3. Desplegar: merge a main y push (dispara GitHub Actions)
git checkout main
git merge develop --no-edit
git push origin main
git checkout develop
```

Tras el push a `main`, comprueba la pestaña **Actions**: cuando el workflow **"Deploy to GitHub Pages"** salga en verde, el artículo estará en producción.

> El deploy **solo** ocurre al hacer push a `main`. Trabajar en `develop` o en `docs/` no publica nada.

---

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor local de desarrollo
npm run build      # build de producción (valida antes de publicar)
npm run preview    # previsualizar el build
```

---

## Notas de operación

- **GitHub Pages** debe estar en `Settings → Pages → Source: GitHub Actions` (ya configurado). El repo debe ser **público** para que Pages funcione en cuenta personal.
- El sitio se sirve bajo el subpath `/pantagruel-research` (ver `base` en `astro.config.mjs`); si cambia el owner o el nombre del repo, actualiza `site` y `base`.
- Este repo vive localmente en `archived/pantagruel-research`; no confundir con el proyecto `pantagruel-alpha`.
