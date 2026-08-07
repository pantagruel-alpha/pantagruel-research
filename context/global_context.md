# Context

## Context

Pantagruel Research es el espacio editorial y blog técnico de Pantagruel Alpha
para trabajos extensos sobre finanzas cuantitativas, machine learning y data
science. El producto combina un corpus editorial mantenible con una aplicación
Astro publicada mediante GitHub Pages en
<https://pantagruel-alpha.github.io/pantagruel-research>.

`docs/` es el taller y la fuente canónica de los artículos en desarrollo. Cada
artículo vive en `docs/YYYY-MM-DD-<slug>/`, con un Markdown homónimo y sus
adjuntos. `src/content/blog/` es la colección publicada: el contenido solo se
promueve allí cuando existe una solicitud explícita de publicación. Los activos
servidos por la web viven bajo `public/`; un push a `main` activa el despliegue
de GitHub Pages, mientras que trabajar en `develop` o `docs/` no publica por sí
mismo.

La línea editorial prioriza análisis rigurosos, trazables y legibles en español,
salvo que se solicite otro idioma. La creación y curación de artículos se trata
como contribución documental; los cambios de interfaz y experiencia del blog se
tratan como trabajo frontend. Los artículos existentes y sus imágenes son
corpus editorial, no contratos de tareas retroactivas.

El [GitHub Project empresarial](https://github.com/users/pantagruel-alpha/projects/3)
es el backlog compartido con Pantagruel. Las tareas de este repositorio se
identifican por su pertenencia a `pantagruel-alpha/pantagruel-research`; sus
contratos futuros vivirán en issues del propio repositorio y no en archivos
locales paralelos. Este documento conserva dirección editorial, decisiones y
memoria del proyecto sin duplicar el tablero.

## Change log

- 2026-08-06 — Pantagruel Research se incorporó al GitHub Project empresarial
  #3 como control de planificación para sus tareas futuras; no existía backlog
  local ni se inventaron issues históricos para los artículos ya publicados.
- 2026-08-06 — La tarea histórica de automatización de publicación se trasladó
  desde Pantagruel al issue #1 de este repositorio y permanece completada.
