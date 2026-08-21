# Context

Pantagruel Research es el espacio editorial y blog técnico de Pantagruel Alpha
para trabajos extensos sobre finanzas cuantitativas, machine learning y data
science. El producto combina un corpus editorial mantenible con una aplicación
Astro publicada mediante GitHub Pages en
<https://pantagruel-alpha.github.io/pantagruel-research>.

[`docs/`](docs/) es el taller y la fuente canónica de los artículos. Cada
artículo vive en `docs/YYYY-MM-DD-<slug>/`, con un Markdown homónimo y sus
adjuntos. [`scripts/sync-articles.mjs`](scripts/sync-articles.mjs) genera desde
ese corpus la colección de la aplicación [Astro](src/) y los adjuntos aislados
bajo `public/articles/`; ambas superficies son derivadas y no se editan ni
versionan manualmente. Los comandos y dependencias viven en
[`package.json`](package.json). El [workflow de GitHub
Pages](.github/workflows/deploy.yml) valida la pull request `develop` → `main`
y solo despliega GitHub Pages cuando esa pull request se fusiona.

La dirección editorial aplica la relación 1:1 «un issue, una rama, un
artículo». Cada artículo se define como una contribución documental propia y se
desarrolla desde `develop` en `article/<issue-number>-<slug>`, con una única
carpeta canónica bajo `docs/`. `develop` es la superficie de preproducción local
y `main` la única rama de publicación online; el paso a `main` ocurre después
de revisar y aprobar la preview local.

La línea editorial prioriza análisis rigurosos, trazables y legibles en español,
salvo que se solicite otro idioma. La creación y curación de artículos se trata
como contribución documental; los cambios de interfaz y experiencia del blog se
tratan como trabajo frontend. Los artículos existentes y sus imágenes son
corpus editorial, no contratos de tareas retroactivas.

El [GitHub Project `pantagruel-research`](https://github.com/users/pantagruel-alpha/projects/4)
es el backlog exclusivo de este producto. Es independiente del [GitHub Project
`pantagruel`](https://github.com/users/pantagruel-alpha/projects/3) y no debe
consultarse este último para responder sobre «backlog», «tareas activas» o
cualquier concepto equivalente dentro de este repositorio, salvo que el usuario
solicite expresamente una consulta transversal. Las tareas de este proyecto son
issues de `pantagruel-alpha/pantagruel-research`; sus
contratos autocontenidos viven en
`context/issues/<issue-number>-<issue-title-kebab-case>.md` en correspondencia
1:1 con los issues del propio repositorio. Este documento conserva dirección editorial, decisiones y
memoria del proyecto sin duplicar el tablero.

Las skills locales versionadas son parte del funcionamiento del proyecto. La
skill de [publicación](.agents/skills/publish-pantagruel-article/SKILL.md)
explica y ejecuta el recorrido rama de artículo → `develop` → preview local →
aprobación → `main` → verificación en GitHub Pages. Cuando el usuario pregunte
cómo publicar, debe responder de manera didáctica y ordenada, distinguir con
claridad desarrollo, pre local y producción, mostrar las URLs relevantes y no
ejecutar la publicación si solo se solicitó una explicación.

Las skills de [LinkedIn](.agents/skills/linkedin-announce-pantagruel-article/SKILL.md)
y [X](.agents/skills/x-announce-pantagruel-article/SKILL.md) preparan o publican,
solo después de verificar producción, invitaciones breves y naturales con tono
académico-profesional. Cada anuncio contiene el enlace exacto al artículo y una
única imagen relevante con texto alternativo. Toda publicación externa exige
confirmación final independiente. Los espejos bajo [`.claude/skills/`](.claude/skills/)
deben permanecer idénticos para ofrecer el mismo comportamiento en Codex y
Claude Code.

## Crear, revisar y publicar un artículo

La guía operativa y el grid de aprobación canónicos están en
[`PUBLISHING.md`](PUBLISHING.md). Cuando el usuario pregunte por el proceso,
explicar el recorrido completo sin ejecutar acciones: issue documental → rama
`article/<issue>-<slug>` desde `develop` → carpeta canónica
`docs/YYYY-MM-DD-<slug>/` → `npm test` y `npm run build` → integración en
`develop` y preview local → aprobación explícita de esa preview → pull request
`develop` → `main` validada por CI → fusión → verificación de GitHub Pages →
difusión social opcional.

El grid no admite atajos: toda modificación editorial invalida la aprobación de
preview; CI debe pasar antes de fusionar; producción debe verificarse antes de
preparar una red social; y LinkedIn y X exigen, cada una, una confirmación final
independiente. Si el usuario solo pide una explicación, no crear ramas, PRs,
merges, despliegues ni publicaciones externas. Aplicar
`.agents/skills/publish-pantagruel-article/` para el recorrido editorial y las
skills específicas de LinkedIn o X para la difusión.

# Change log
