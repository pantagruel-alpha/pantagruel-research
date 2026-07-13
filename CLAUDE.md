# Pantagruel Research — Guía de publicación (Claude)

Este archivo replica la guía de publicación del repositorio. La **fuente de verdad** es [`AGENTS.md`](./AGENTS.md); consúltalo para el detalle completo.

- **Sitio en producción**: https://pantagruel-alpha.github.io/pantagruel-research
- **Repositorio**: `pantagruel-alpha/pantagruel-research`
- **Stack**: Astro (plantilla Astrofy) + GitHub Pages vía GitHub Actions.
- **Idioma por defecto**: español.

---

## Flujo de publicación (resumen)

1. Crea el artículo en `src/content/blog/<slug>.md` con su frontmatter.
2. Mantén su **copia de desarrollo** en `docs/<slug>/<slug>.md` junto a sus adjuntos.
3. Valida con `npm run build`.
4. Commit en `develop` → `git push origin develop`.
5. `git checkout main && git merge develop --no-edit && git push origin main`.
6. **El push a `main` dispara el deploy** de GitHub Actions a GitHub Pages.

---

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

## Reglas clave

- **Sin LaTeX**: no hay plugin de matemáticas; usa texto o bloques de código, no `$$...$$`.
- **Imágenes**: se sirven desde `public/`.
- **Solo `main` publica**: `develop` no despliega.
- **Repo público + Pages en modo GitHub Actions** son requisitos del deploy.
- Cada artículo publicado tiene su carpeta espejo en `docs/<slug>/`.

Para todo lo demás (comandos, estructura de `docs/`, notas de operación), ver `AGENTS.md`.
