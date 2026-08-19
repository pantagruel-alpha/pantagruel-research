## Context

Skills: generic-contribution, documental-contribution
Status: In progress
Assignee: aprendesc
Milestone: 001 — Publicación editorial
Labels: skill:generic-contribution, skill:documental-contribution

---

Pantagruel Research necesita un ciclo editorial reproducible que mantenga un
único Markdown canónico por artículo, permita revisarlo localmente antes de
publicarlo y reserve la difusión en redes para después de verificar producción.

El flujo acordado es: rama exclusiva del artículo creada desde `develop`, merge
a `develop`, preview local, aprobación, merge de `develop` a `main` y despliegue
online mediante GitHub Pages. LinkedIn y X comparten una skill global con
copy y controles de publicación específicos por red.

La implementación corresponde a la rama
`feature/1-automate-pantagruel-research-publication`. El workflow actual ya
despliega `main`; `npm run build` y `astro preview` se han verificado localmente
en `http://127.0.0.1:4321/pantagruel-research/`.

## Contract

### Task

#### Parameters

- **Surfaces**: código Node/Astro, configuración npm, workflow editorial,
  contexto de proyecto y skills locales.
- **Coding guidelines**: implementación mínima y explícita según las
  convenciones JavaScript/Astro del repositorio.
- **Governing skills**: `generic-contribution` para el comportamiento observable,
  la sincronización y el despliegue; `documental-contribution` para `AGENTS.md`
  y las skills.
- **Target paths**: `AGENTS.md`, `scripts/`, `package.json`, `package-lock.json`,
  `pnpm-lock.yaml`, `.gitignore`,
  `.github/workflows/deploy.yml`, `src/components/BaseHead.astro`,
  `src/pages/rss.xml.js`, `.agents/skills/`, `.claude/skills/` y `tests/`.

#### Objectives

- Implantar el recorrido rama de artículo → `develop` y preview local →
  `main` y producción.
- Mantener `docs/` como única fuente editorial y generar desde ella las
  superficies que Astro necesita para construir.
- Comunicar la URL local exacta del artículo durante pre y verificar la URL
  online después de producción.
- Preparar en una segunda entrega del mismo issue un automatismo conjunto para
  anunciar artículos verificados en LinkedIn y X, después de validar el ciclo
  web, manteniendo ejecución y confirmación independientes por red.

#### Constraints

- Una rama de artículo contiene exactamente un artículo y sus adjuntos.
- `develop` nunca despliega en Internet; `main` es la única rama de producción.
- No se introducen hosting de pre, estados adicionales ni servicios nuevos.
- El merge a `main` requiere aprobación explícita tras revisar pre.
- Las publicaciones externas requieren su propia confirmación final y nunca se
  disparan como efecto lateral de un despliegue.
- Se preservan URLs, artículos y cambios ajenos existentes.

#### Validation

- El build, la preview local, las pruebas y `git diff --check` deben pasar.
- Un ensayo debe demostrar que un artículo canónico aparece en pre sin tocar
  producción y que el mismo contenido queda listo para el build de `main`.
- Las skills modificadas o creadas deben superar su validación estructural.

### Functional design

#### Parameters

- **Purpose / outcomes**: redactar un artículo una sola vez, revisarlo como web
  en local y publicarlo online únicamente después de aprobarlo.
- **Scope / exclusions**: incluye el ciclo editorial, su automatización y las
  skills de difusión; excluye un entorno remoto de pre y la publicación real
  de un artículo o anuncio durante la implementación.
- **Sources**: decisiones del usuario de 2026-08-10 y estructura actual de
  `docs/`, Astro y GitHub Pages.

#### Specification

Cada artículo tiene su propio issue de contribución documental y nace en
`article/<issue-number>-<slug>`, creada desde `develop`. La rama solo añade
`docs/YYYY-MM-DD-<slug>/`, con un Markdown homónimo y sus adjuntos. Al terminar
la redacción se integra en `develop`.

Desde `develop`, el flujo de publicación genera el contenido Astro desde
`docs/`, construye el sitio, inicia la preview local y comunica la URL exacta
del artículo. Si se solicitan cambios, se realizan en la misma rama del
artículo, se vuelven a integrar y se repite la preview.

Tras la aprobación explícita, `develop` se integra en `main`. El workflow de
GitHub Pages publica el sitio y el proceso verifica la URL online. Solo después
se pueden preparar o publicar anuncios independientes en LinkedIn y X.

Todo fallo de validación, build, preview, despliegue o verificación detiene el
recorrido y se comunica sin afirmar que la etapa haya terminado.

#### Acceptance criteria

- Una rama con un solo artículo puede integrarse en `develop` y visualizarse
  mediante una URL local exacta sin cambiar producción.
- `docs/` contiene el único Markdown editorial; las copias para Astro son
  derivadas y reproducibles.
- El contenido aprobado en pre es el que `main` construye y publica.
- El flujo bloquea ramas con más de un artículo, colisiones de adjuntos y
  diferencias entre la fuente canónica y su proyección.
- LinkedIn y X permanecen separados de la publicación web y conservan copy,
  ejecución, confirmación y verificación independientes dentro de una única
  skill global.
- Cada anuncio incluye en su cuerpo el enlace exacto al artículo y se publica
  con una única imagen relevante; el texto es breve, natural y de tono
  académico-profesional, sin fórmulas estereotipadas o sintéticas.
- Una solicitud de explicación activa la skill de publicación en modo
  didáctico: describe desarrollo, pre local, revisión, producción y difusión
  sin ejecutar ninguna transición ni confundir explicación con autorización.

### Technical design

#### Parameters

- **Objective / scope**: generar la colección Astro desde `docs/`, servirla en
  local desde `develop` y reutilizar la misma generación en el build de `main`.
- **Target paths**: `scripts/sync-articles.mjs`, `package.json`,
  `package-lock.json`, `pnpm-lock.yaml`, `.gitignore`,
  `.github/workflows/deploy.yml`, `src/components/BaseHead.astro`,
  `src/pages/rss.xml.js`, `.agents/skills/publish-pantagruel-article/`, su
  espejo de Claude y `tests/article-publication/`.
- **Stack / dependencies**: Node.js 20, Astro 4, APIs estándar de Node,
  `unified`/`remark-parse` para interpretar CommonMark y GitHub Actions
  existente; no añadir servicios ni dependencias de runtime.
- **Coding guidelines**: implementación mínima, explícita y conforme a las
  convenciones JavaScript/Astro existentes.
- **Accepted requirements**: una rama por artículo, un Markdown canónico,
  preview solo local y producción solo desde `main`.

#### Key decisions

1. `docs/` será la única fuente editorial versionada. La colección Astro y los
   adjuntos servidos se generarán antes de cada build.
2. Pre usará `npm run build` seguido de
   `npm run preview -- --host 127.0.0.1`; no habrá deploy remoto ni git hook.
3. La skill de publicación resolverá el slug construido, comunicará la URL
   local exacta y protegerá las fronteras `develop`/`main`.
4. El workflow de producción existente seguirá limitado a `main` y ejecutará
   la misma sincronización mediante el ciclo npm.
5. La primera entrega del issue implementará Development → Pre → Pro. La
   segunda entrega abordará LinkedIn y X mediante una única skill global sobre
   esa base ya validada.

#### Architecture

```text
article/<issue-number>-<slug>
└── docs/YYYY-MM-DD-<slug>/
    ├── YYYY-MM-DD-<slug>.md
    └── adjuntos
             │ merge
             ▼
          develop ── sync → build → preview local → URL exacta
             │
             │ aprobación + merge
             ▼
            main ── sync → build → GitHub Pages → URL online
```

`scripts/sync-articles.mjs` validará las carpetas canónicas, generará de forma
determinista `src/content/blog/` y proyectará adjuntos en `public/`. La ejecución
repetida con la misma entrada producirá el mismo árbol. La skill comparará la
rama del artículo con `develop` y rechazará más de una carpeta canónica o
cambios ajenos. Los errores se propagarán con salida no cero para detener npm o
GitHub Actions.

Las referencias relativas a adjuntos se resolverán durante la proyección sin
alterar el Markdown canónico, mediante el árbol sintáctico CommonMark y sin
reescribir ejemplos de código. La proyección se preparará en árboles temporales,
rechazará destinos simbólicos y sustituirá los árboles generados con rollback.
Los metadatos sociales y RSS incorporarán el `base` de GitHub Pages y
utilizarán la misma ruta de artículo que Astro genera.

La skill `publish-pantagruel-article` tendrá dos fronteras operativas: preview
desde `develop` y producción desde `main` después de confirmación. No duplicará
la lógica de sincronización, sino que invocará el script, el build y la preview.

#### Validation

- Pruebas Node para descubrimiento, nombres, copia reproducible, colisiones y
  rechazo de estructuras inválidas.
- Ensayo del diff de una rama de artículo frente a `develop`, aceptando una
  única carpeta canónica y rechazando cambios ajenos.
- Build completo del corpus existente y comparación de las rutas generadas.
- Preview local con respuesta HTTP 200 para el artículo esperado.
- Validación estructural de las skills y comprobación de sincronía entre
  `.agents/skills/` y `.claude/skills/`.
- Confirmación de que `.github/workflows/deploy.yml` solo despliega `main`.

### Document

#### Parameters

- **Type**: external
- **Format**: markdown
- **Target path**: `AGENTS.md`,
  `.agents/skills/publish-pantagruel-article/SKILL.md`,
  `.claude/skills/publish-pantagruel-article/SKILL.md`,
  `~/.codex/skills/pantagruel-research-social-announce/SKILL.md`.

#### Style rules

Mantener instrucciones concisas, imperativas y autosuficientes. Separar con
claridad desarrollo, pre local, producción y difusión externa. No duplicar el
contrato del issue dentro de `AGENTS.md`.

#### Table of contents

- Contexto del proyecto: decisión duradera «una rama, un artículo» y relación
  entre `develop` y `main`.
- Publicación: preparación del artículo, preview local, aprobación, producción
  y verificación.
- Difusión: límites y dependencias posteriores para LinkedIn y X.

## Change log

- 2026-08-10 11:46 — Issue reactivado y refinado con el ciclo acordado de rama
  de artículo, pre local en `develop` y producción en `main`.
- 2026-08-10 11:46 — Corregida la ruta contractual a
  `context/issues/1-automate-pantagruel-research-publication.md`, adoptado el
  wrapper de Development Methodology y registrada la rama
  `feature/1-automate-pantagruel-research-publication`.
- 2026-08-10 11:52 — Auditoría metodológica aplicada: añadido `Labels`,
  completados parámetros técnicos y documentales, y alineada la regla de
  artículos con la trazabilidad `article/<issue-number>-<slug>`.
- 2026-08-10 12:08 — Implementados sincronización reproducible, preview local,
  protección de producción, skills independientes para publicación, LinkedIn
  y X, y correcciones de rutas para adjuntos, metadatos sociales y RSS.
- 2026-08-10 12:13 — Validación completada con 10 pruebas Node, build Astro de
  18 páginas, respuestas HTTP 200 en artículos y activos, validación oficial de
  las seis skills y comprobación de sincronía entre harnesses.
- 2026-08-10 12:29 — Verificado el ciclo exacto de CI (`npm ci`, aplicación del
  parche de sitemap, pruebas y build) y reforzada la cobertura CommonMark y
  transaccional.
- 2026-08-10 12:42 — Refinadas las skills de LinkedIn y X: invitación breve y
  natural, tono académico-profesional, una imagen obligatoria y enlace exacto
  al artículo dentro del cuerpo de ambas publicaciones.
- 2026-08-10 12:48 — Reflejado en `AGENTS.md` el cometido de las tres skills y
  añadido a la skill de publicación un modo explicativo didáctico que no
  ejecuta acciones.
- 2026-08-16 — Retiradas `functional-specs` y `technical-specs`; el contrato
  funcional y técnico existente queda gobernado por `generic-contribution`,
  sin perder decisiones ni criterios de validación.
- 2026-08-16 — Fusionadas las skills separadas de LinkedIn y X en la skill
  global `pantagruel-research-social-announce`, conservando copy, previsualización,
  confirmación, publicación y verificación independientes por red.
