---
name: publish-pantagruel-article
description: Publish, deploy, republish, or verify one Pantagruel Research article by promoting its canonical Markdown and attachments from docs/ into the Astro site and deploying through develop and main. Use when the user explicitly asks to make a named article live, requests a production publication check, or asks how the publication workflow works.
---

# Publicar un artículo de Pantagruel Research

## Principios

- Tratar `docs/` como fuente de verdad editorial y `src/content/blog/` como contenido publicado.
- Publicar únicamente tras una petición explícita del usuario.
- Exigir un artículo concreto e inequívoco de `docs/`; si falta o hay varias coincidencias, pedir que lo identifique.
- Ejecutar el flujo completo hasta producción cuando el usuario pida publicar, salvo que limite expresamente el alcance.
- Conservar cambios ajenos y no incluirlos en commits, merges ni pushes.
- Recordar que solo un push a `main` despliega; trabajar en `docs/` o `develop` no publica.

## Preparar la publicación

1. Localizar `docs/YYYY-MM-DD-<slug>/YYYY-MM-DD-<slug>.md` y confirmar que carpeta y Markdown tienen el mismo nombre.
2. Revisar el estado y las ramas con `git status --short --branch`, `git branch -vv` y `git fetch origin`.
3. Detenerse si cambios no relacionados impiden cambiar de rama, construir o aislar el commit con seguridad.
4. Actualizar `develop` mediante fast-forward antes de copiar contenido:

```bash
git checkout develop
git pull --ff-only origin develop
```

5. Validar el frontmatter contra `src/content/config.ts`:
   - `title`, `description` y `pubDate` son obligatorios.
   - Mantener `pubDate` en formato `Mmm DD YYYY`.
   - `updatedDate`, `heroImage`, `badge` y `tags` son opcionales.
   - No repetir tags dentro del artículo.
6. Confirmar que no se usan bloques `$$...$$`; el sitio no tiene renderizado LaTeX.
7. Identificar todos los adjuntos locales referenciados. Una ruta raíz como `/imagen.webp` corresponde a `public/imagen.webp`.
8. Detectar colisiones antes de copiar:
   - Si el Markdown de destino ya existe, sobrescribirlo solo cuando represente el mismo artículo.
   - Si un adjunto de `public/` ya existe con contenido diferente, detenerse y pedir una decisión de nombre; no sobrescribirlo silenciosamente.

## Promover y validar

1. Copiar el Markdown a `src/content/blog/<slug>.md`, omitiendo por defecto el prefijo de fecha del nombre de archivo.
2. Copiar a `public/` todos los adjuntos referenciados.
3. Instalar dependencias con `npm ci` si todavía no están disponibles.
4. Ejecutar:

```bash
npm run build
git diff --check
```

5. Inspeccionar el diff y confirmar que:
   - El artículo publicado coincide con su fuente en `docs/`.
   - Los adjuntos requeridos están presentes.
   - No hay cambios ajenos.
   - El build generó la página esperada. Con `GENERATE_SLUG_FROM_TITLE = true`, la URL del artículo se deriva de `title`, no del nombre del archivo.

## Publicar

1. Añadir únicamente el Markdown publicado y sus adjuntos mediante rutas explícitas:

```bash
git add -- src/content/blog/<slug>.md public/<adjunto-1> public/<adjunto-n>
```

2. Crear el commit en `develop`:

```bash
git commit -m "content: publicar <título>"
git push origin develop
```

3. No crear un commit vacío si el artículo ya está actualizado. Comprobar en ese caso si `main` aún necesita recibir commits de `develop`.
4. Desplegar desde `main`:

```bash
git checkout main
git pull --ff-only origin main
git merge develop --no-edit
git push origin main
git checkout develop
```

5. Confirmar al final que `develop` está activo y que el árbol de trabajo conserva intactos los cambios no relacionados.

## Verificar producción

1. Esperar a que el workflow `Deploy to GitHub Pages` asociado al push de `main` finalice.
2. Considerar publicada la entrada solo si el workflow termina correctamente.
3. Verificar, cuando sea posible, la página bajo:

```text
https://pantagruel-alpha.github.io/pantagruel-research/blog/<slug-del-title>
```

4. Informar del artículo, commits o ramas publicados, resultado del workflow y URL final. Si el deploy falla, comunicar el fallo y diagnosticarlo; no afirmar que el artículo está en producción.
