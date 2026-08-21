---
name: publish-pantagruel-article
description: Prepare, preview, publish, republish, or verify one Pantagruel Research article through its article branch, local develop preview, explicit approval, and main deployment to GitHub Pages. Use when the user asks to preview a named article, make it live, check its production publication, or explain the publication workflow.
---

# Publicar un artículo de Pantagruel Research

## Explicar el flujo de forma didáctica

Cuando el usuario pregunte cómo se publica, explicar antes de actuar y no
modificar ramas, abrir merges, desplegar ni publicar nada. Adaptar el detalle a
su nivel y presentar el recorrido en este orden:

1. **Desarrollo**: cada artículo tiene una issue, una rama
   `article/<issue-number>-<short-kebab-name>` creada desde `develop` y una sola
   carpeta canónica `docs/YYYY-MM-DD-<slug>/` con su Markdown y adjuntos.
2. **Pre local**: al integrar la rama en `develop`, ejecutar pruebas y build,
   iniciar la preview y facilitar la URL local exacta. Aclarar que `develop` no
   publica nada en Internet.
3. **Revisión**: el usuario inspecciona el artículo. Si solicita correcciones,
   volver a la misma rama del artículo, repetir la integración y generar una
   nueva preview; cualquier aprobación anterior queda invalidada.
4. **Producción**: solo tras la aprobación explícita de la preview vigente,
   abrir y fusionar una pull request `develop` → `main`; CI valida la PR y
   GitHub Pages despliega después de la fusión. A continuación se verifica la
   URL pública exacta.
5. **Difusión**: explicar LinkedIn y X como pasos posteriores, opcionales e
   independientes, cada uno con su propia skill y confirmación final.

Comenzar con un resumen sencillo como
`rama del artículo → develop/preview local → aprobación → main/producción`.
Definir cualquier término Git necesario, mostrar los comandos y URLs útiles
junto a la fase correspondiente y terminar indicando el estado actual y cuál
sería la siguiente decisión del usuario. No confundir la explicación con una
autorización para ejecutar el flujo.

El grid de aprobación de `PUBLISHING.md` es vinculante: la revisión editorial
autoriza la preview, el usuario aprueba explícitamente la preview vigente, CI
verde permite fusionar la PR, la verificación de producción permite preparar
redes y cada red requiere su propia confirmación final. Un cambio editorial
reinicia el grid desde la validación local.

## Respetar las fronteras

- Tratar `docs/YYYY-MM-DD-<slug>/` como única fuente editorial. No editar ni versionar manualmente sus proyecciones en `src/content/blog/` o `public/`.
- Exigir para cada artículo una issue propia de `documental-contribution` y mantener la relación 1:1 con su rama `article/<issue-number>-<short-kebab-name>`, creada desde `develop` y limitada a un artículo.
- Usar `develop` únicamente para construir y servir una preview local. No desplegar pre ni introducir servicios o estados adicionales.
- Integrar `develop` en `main` solo mediante su pull request y después de que el usuario apruebe explícitamente la preview actual. Un permiso general para publicar no sustituye esa aprobación posterior.
- Detener el recorrido ante cualquier fallo y comunicarlo sin afirmar que la etapa terminó.
- Conservar cambios ajenos y excluirlos de commits, merges y pushes.

## Preparar e integrar el artículo

1. Resolver un artículo concreto e inequívoco. Exigir que carpeta y Markdown compartan `YYYY-MM-DD-<slug>` y que los adjuntos permanezcan en esa carpeta.
2. Revisar el estado, actualizar referencias remotas y confirmar que la issue, la rama y el artículo mantienen trazabilidad 1:1.
3. Inspeccionar `git diff --name-status origin/develop...HEAD`. Exigir que todas las rutas pertenezcan a una única carpeta canónica `docs/YYYY-MM-DD-<slug>/`; rechazar más carpetas de artículo o cualquier cambio no relacionado.
4. Validar el Markdown y sus adjuntos con las pruebas y comandos vigentes del repositorio. No reproducir manualmente la lógica del generador.
5. Integrar la rama del artículo en `develop` mediante el mecanismo habitual del repositorio, sin publicar `main`.

## Servir la preview local

1. Activar `develop` actualizado e instalar dependencias con `npm ci` cuando sea necesario.
2. Ejecutar las pruebas de publicación, `npm run build` y `git diff --check`. El build debe generar desde `docs/` las superficies de Astro y dejar la proyección idéntica a la fuente canónica.
3. Resolver la ruta realmente construida del artículo en `dist/blog/<slug>/index.html`; no deducirla solo del nombre del archivo porque puede derivarse del título.
4. Iniciar la preview desde `develop`:

```bash
npm run preview -- --host 127.0.0.1
```

5. Comprobar una respuesta HTTP correcta y comunicar la URL exacta:

```text
http://127.0.0.1:4321/pantagruel-research/blog/<slug>/
```

6. Mantener producción intacta y solicitar la aprobación explícita de esa preview antes de continuar.

## Corregir tras la preview

1. Volver a la misma `article/<issue-number>-<short-kebab-name>` e incorporar en ella el `develop` vigente.
2. Modificar únicamente el Markdown canónico o sus adjuntos en `docs/`.
3. Reintegrar la rama en `develop` y repetir build, validaciones, preview y comunicación de la URL exacta.
4. Considerar caducada cualquier aprobación anterior cuando cambie el artículo; solicitar otra aprobación sobre la nueva preview.

## Publicar en producción

1. Confirmar que la aprobación explícita corresponde al contenido actualmente validado en `develop` y registrar el commit aprobado.
2. Abrir la pull request `develop` → `main` y exigir que CI valide pruebas y build. Fusionarla solo si todas las validaciones siguen pasando, sin alterar ni omitir contenido ajeno.
3. Esperar al workflow `Deploy to GitHub Pages` asociado a la pull request fusionada y exigir conclusión satisfactoria.
4. Resolver y consultar la URL online exacta del mismo slug:

```text
https://pantagruel-alpha.github.io/pantagruel-research/blog/<slug>/
```

5. Verificar respuesta HTTP correcta y que la página corresponde al artículo aprobado. Informar commits, resultado del workflow y URL final.
6. Si el despliegue o la comprobación falla, diagnosticar y comunicar el fallo; no declarar el artículo publicado.

## Mantener separada la difusión

- No preparar ni publicar LinkedIn o X como efecto lateral de este flujo.
- Tratar cada red con su propia skill y confirmación final, y solo después de verificar producción.
