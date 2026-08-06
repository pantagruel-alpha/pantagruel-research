# Pantagruel Research

## Context

Pantagruel Research is the technical blog of Pantagruel Alpha for long-form work on quantitative finance, machine learning, and data science. It is built with Astro and deployed to GitHub Pages at `https://pantagruel-alpha.github.io/pantagruel-research`.

Use Spanish by default unless the user requests another language.

## Product classification

`documental-contribution` governs article creation and editorial changes. `frontend-app` governs changes to the blog interface.

## Project structure

- `docs/`: canonical editorial workspace. Each article lives in `YYYY-MM-DD-<slug>/` with a same-named Markdown file and its attachments.
- `docs/context.md`: locally ignored project memory; `docs/sessions/`: globally ignored session summaries; `docs/issues/<issue-title-kebab-case>/`: versioned issue-specific supporting documents when needed.
- `src/content/blog/`: published Astro collection; content enters it only through an explicit publication request.
- `public/`: static assets referenced by published articles and the site.
- `.agents/skills/` and `.claude/skills/`: synchronized project-local workflows for Codex and Claude Code.
- `.github/workflows/deploy.yml`: GitHub Pages deployment triggered by pushes to `main`.

## Instructions

- Use GitHub Project `pantagruel` (#3, owner `pantagruel-alpha`) as the canonical backlog. Tasks for this product are issues in `pantagruel-alpha/pantagruel-research`, assigned to `aprendesc` by default.
- Use the project-local `$publish-pantagruel-article` skill whenever the user asks to publish, deploy, republish, or verify an article.
- Use the project-local `$linkedin-announce-pantagruel-article` skill whenever the user asks to prepare, rehearse, publish, or verify a LinkedIn announcement for a blog article.
