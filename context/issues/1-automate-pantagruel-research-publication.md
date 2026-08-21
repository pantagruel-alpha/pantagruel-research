# Issue #1 — Automate Pantagruel Research Publication

## Context

Pantagruel Research publica el corpus editorial canónico de `docs/` como una
aplicación Astro en GitHub Pages. La automatización ya sincroniza los artículos
y sus adjuntos, pero el ciclo de integración, despliegue y difusión necesita
una definición verificable y mantenida junto al repositorio.

La integración autorizada para producción es una pull request de `develop` a
`main`. `develop` sigue siendo exclusivamente la superficie de preview local;
`main` es la única superficie de producción. La issue remota conserva estado,
asignación y Project; este contrato es la fuente de alcance y decisiones.

## Contract

### Task

#### Parameters

- **Surfaces**: configuration, code, documentation and local skills.
- **Governing skills**: `generic-contribution` for the integrated change and
  `documental-contribution` for this contract and the publication guide.
- **Target paths**: `.github/workflows/deploy.yml`, `PUBLISHING.md`,
  `.agents/skills/`, `.claude/skills/` and this contract.

#### Objectives

- Validate every pull request whose source is `develop` and target is `main`.
- Deploy GitHub Pages only after that pull request is merged successfully.
- Keep `docs/` as the sole editorial source and preserve `develop` as a local
  preview surface with no Internet deployment.
- Document the article publication flow from article branch to verified
  production.
- Refine the local LinkedIn and X skills so that dissemination stays optional,
  separate, production-verified and subject to a final confirmation.
- Keep each `.agents/skills/` publication skill byte-identical to its mirror in
  `.claude/skills/`.

#### Constraints

- Do not deploy for a closed-but-unmerged PR, a PR with another source or base,
  or a direct push to `main`.
- Do not publish to LinkedIn or X as part of CI or without an independent final
  user confirmation.
- Do not add non-article files under `docs/`, because the synchronizer rejects
  them.
- Preserve unrelated changes and do not modify remote state without explicit
  authorization.

#### Validation

- Run the publication tests, production build and whitespace check locally.
- Validate the GitHub Actions workflow syntax and its event/job conditions.
- Confirm the three skill mirrors are identical after every update.

### Document

#### Parameters

- **Type**: `external`
- **Format**: `markdown`
- **Target path**: `PUBLISHING.md`

#### Style rules

Spanish, concise and operational. Explain the route in chronological order;
distinguish local preview, CI validation, production deployment and optional
social dissemination. Name the authoritative source and the approval gates.

#### Table of contents

1. Purpose and canonical surfaces: source of truth and branch roles.
2. Article development: issue, branch and canonical directory requirements.
3. Pull request and CI: the exact `develop` to `main` validation and merge
   gate.
4. Production verification: GitHub Pages workflow and public URL check.
5. Social dissemination: separate, optional LinkedIn and X workflows.

## Change log

- 2026-08-21: Recreated the missing canonical contract and recorded the
  approved CI, documentation and social-skill scope.
