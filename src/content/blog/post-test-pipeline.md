---
title: "Pipeline check: publishing a test note"
description: "A short test entry to validate the end-to-end publishing pipeline of Pantagruel Research — from content authoring in Astro to deployment on GitHub Pages."
pubDate: "Jul 13 2026"
heroImage: "/post_img.webp"
tags: ["pantagruel", "test", "infra"]
badge: "TEST"
---

## Purpose

This is a **test entry** created to verify that the Pantagruel Research publishing pipeline works end to end: authoring a Markdown post in `src/content/blog/`, building the site with Astro, and deploying to GitHub Pages via GitHub Actions.

---

## What this checks

1. The content collection schema accepts a new post.
2. The Astro build renders the entry without errors.
3. The deploy workflow publishes it to the live site.

If you can read this on the live blog, the pipeline is healthy. This note can be safely removed afterwards.
