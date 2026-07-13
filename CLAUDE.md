# Pantagruel Research — Guía de publicación (Claude)

Este archivo replica la guía de publicación del repositorio. La **fuente de verdad** es [`AGENTS.md`](./AGENTS.md); consúltalo para el detalle completo.

- **Sitio en producción**: https://pantagruel-alpha.github.io/pantagruel-research
- **Repositorio**: `pantagruel-alpha/pantagruel-research`
- **Stack**: Astro (plantilla Astrofy) + GitHub Pages vía GitHub Actions.
- **Idioma por defecto**: español.

---

## Modelo de trabajo

- Se **redacta en `docs/`**, no directamente en `src/content/blog/`.
- Los artículos **no se publican solos**: solo al **solicitarlo explícitamente**, indicando **qué artículo** de `docs/` se publica, se lleva a `src/content/blog/` y se despliega.
- `docs/` = taller (contenido en desarrollo); `src/content/blog/` = escaparate (lo que sirve la web).

## Estructura de `docs/`

Una carpeta por artículo, **con la fecha de desarrollo como prefijo** (`YYYY-MM-DD`) para ordenar cronológicamente:

```text
docs/
  YYYY-MM-DD-<slug>/
    YYYY-MM-DD-<slug>.md   # documento del artículo (mismo nombre que la carpeta)
    <adjuntos...>          # imágenes u otros archivos
```

Ejemplo:

```text
docs/
  2026-03-22-welcome-to-pantagruel-research/
    2026-03-22-welcome-to-pantagruel-research.md
    post_img.webp
  2026-07-13-perceptron-rosenblatt/
    2026-07-13-perceptron-rosenblatt.md
    post_img.webp
```

## Frontmatter mínimo

```markdown
---
title: "Título"            # obligatorio (genera el slug/URL)
description: "Resumen."     # obligatorio
pubDate: "Jul 13 2026"      # obligatorio ("Mmm DD YYYY")
heroImage: "/post_img.webp" # opcional (bajo public/)
badge: "NEW"                # opcional
tags: ["a", "b"]            # opcional, únicos
---
```

## Publicar (bajo demanda, indicando el artículo)

1. Copia `docs/YYYY-MM-DD-<slug>/YYYY-MM-DD-<slug>.md` → `src/content/blog/<slug>.md`.
2. Copia a `public/` los adjuntos referenciados (p. ej. `heroImage`).
3. `npm run build` para validar.
4. Commit en `develop` → `git push origin develop`.
5. `git checkout main && git merge develop --no-edit && git push origin main`.
6. **El push a `main` dispara el deploy** a GitHub Pages.

## Reglas clave

- **Solo `main` publica**; `develop` y `docs/` no despliegan.
- **Sin LaTeX**: no hay plugin de matemáticas; usa texto o bloques de código, no `$$...$$`.
- **Imágenes**: se sirven desde `public/`.
- **Tags únicos** (el build falla si se repiten).
- **Repo público + Pages en modo GitHub Actions** son requisitos del deploy.

Para todo lo demás (comandos, notas de operación, detalle de publicación), ver `AGENTS.md`.
