# Pantagruel Research

## Context

Pantagruel Research is the technical blog of Pantagruel Alpha for long-form work on quantitative finance, machine learning, and data science. It is built with Astro and deployed to GitHub Pages at `https://pantagruel-alpha.github.io/pantagruel-research`.

Use Spanish by default unless the user requests another language.

## Product classification

`documental-contribution` governs article creation and editorial changes. `frontend-app` governs changes to the blog interface.

## Project structure

- `docs/`: canonical editorial workspace. Each article lives in `YYYY-MM-DD-<slug>/` with a same-named Markdown file and its attachments.
- `context/`: locally ignored project memory in `global_context.md`, session
  transcripts and summaries in `sessions/`, and issue-specific supporting
  documents under `<issue-number>-<issue-title-kebab-case>/` when needed.
- `src/content/blog/`: published Astro collection; content enters it only through an explicit publication request.
- `public/`: static assets referenced by published articles and the site.
- `.agents/skills/` and `.claude/skills/`: synchronized project-local workflows for Codex and Claude Code.
- `.github/workflows/deploy.yml`: GitHub Pages deployment triggered by pushes to `main`.

## Instructions

- GitHub issues: [pantagruel-alpha/pantagruel-research](https://github.com/pantagruel-alpha/pantagruel-research/issues).
- Use [GitHub Project `pantagruel`](https://github.com/users/pantagruel-alpha/projects/3) as the canonical backlog. Tasks for this product are issues in `pantagruel-alpha/pantagruel-research`, assigned to `aprendesc` by default; use the GitHub connector first and `gh` only for Project operations it does not expose.
- The local `$publish-pantagruel-article` skill governs publication, deployment, republication, and production verification. On an explicit request for a specific article, promote its canonical content from `docs/` to the Astro collection, validate it, publish through `develop` and `main`, and verify the deployment.
- The local `$linkedin-announce-pantagruel-article` skill governs LinkedIn announcements for published articles. Prepare or rehearse the post as requested; publish only after an immediate final confirmation of the reviewed post.
