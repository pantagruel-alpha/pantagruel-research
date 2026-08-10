import assert from 'node:assert/strict';
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { syncArticles } from '../../scripts/sync-articles.mjs';

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'pantagruel-articles-'));
  await mkdir(path.join(root, 'docs'));
  await mkdir(path.join(root, 'public'), { recursive: true });
  return root;
}

async function article(root, name, markdown = '# Article\n', attachments = {}) {
  const directory = path.join(root, 'docs', name);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, `${name}.md`), markdown);
  for (const [relativePath, content] of Object.entries(attachments)) {
    const target = path.join(directory, relativePath);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, content);
  }
}

async function seedProjection(root) {
  await mkdir(path.join(root, 'src/content/blog'), { recursive: true });
  await mkdir(path.join(root, 'public/articles/old-post'), { recursive: true });
  await writeFile(path.join(root, 'src/content/blog/old-post.md'), '# Existing projection\n');
  await writeFile(path.join(root, 'public/articles/old-post/image'), 'existing asset');
}

async function assertProjectionUnchanged(root) {
  assert.equal(
    await readFile(path.join(root, 'src/content/blog/old-post.md'), 'utf8'),
    '# Existing projection\n',
  );
  assert.equal(
    await readFile(path.join(root, 'public/articles/old-post/image'), 'utf8'),
    'existing asset',
  );
}

async function rejectsWithoutMutation(setup, expected) {
  const root = await fixture();
  await seedProjection(root);
  await setup(root);
  await assert.rejects(syncArticles(root), expected);
  await assertProjectionUnchanged(root);
}

test('generates stable article and isolated attachment projections', async () => {
  const root = await fixture();
  await article(root, '2026-08-10-second-post', [
    '# Second',
    '',
    '![Chart](images/chart.svg)',
    '![Titled](images/chart.svg "contains ]( marker")',
    '`![Example](images/chart.svg)`',
    '``![Example](images/chart.svg)``',
    '```md',
    '![Example](images/chart.svg)',
    '```',
    '````md',
    '```',
    '![Example](images/chart.svg)',
    '````',
    '    ![Example](images/chart.svg)',
    '`start',
    '![Example](images/chart.svg)',
    'end`',
    '> ```md',
    '> ![Example](images/chart.svg)',
    '> ```',
    'literal](images/chart.svg)',
    '![Space][space]',
    '',
    '[space]: <images/my chart.svg>',
    '![Defined][foo\\]:bar]',
    '',
    '[foo\\]:bar]: images/chart.svg "title"',
    '![Encoded](images/my%20chart.svg)',
    '![Hash](images/foo%23bar.svg)',
    '![Percent](100%.svg)',
    '![Paren](images/chart(1).svg)',
    '![Escaped](images/chart\\(1\\).svg)',
    '',
  ].join('\n'), {
    'images/chart.svg': '<svg>second</svg>',
    'images/my chart.svg': '<svg>space</svg>',
    'images/foo#bar.svg': '<svg>hash</svg>',
    'images/chart(1).svg': '<svg>parentheses</svg>',
    '100%.svg': '<svg>percent</svg>',
    '.article-assets.json': 'ordinary attachment',
  });
  await article(root, '2026-01-02-first-post', '# First\n', {
    'images/chart.svg': '<svg>first</svg>',
  });

  assert.deepEqual(await syncArticles(root), { articles: 2, assets: 7 });
  assert.deepEqual(await readdir(path.join(root, 'src/content/blog')), [
    'first-post.md',
    'second-post.md',
  ]);
  assert.equal(await readFile(path.join(root, 'src/content/blog/first-post.md'), 'utf8'), '# First\n');
  assert.equal(
    await readFile(path.join(root, 'public/articles/first-post/images/chart.svg'), 'utf8'),
    '<svg>first</svg>',
  );
  assert.equal(
    await readFile(path.join(root, 'public/articles/second-post/images/chart.svg'), 'utf8'),
    '<svg>second</svg>',
  );
  assert.equal(
    await readFile(path.join(root, 'public/articles/second-post/.article-assets.json'), 'utf8'),
    'ordinary attachment',
  );
  await assert.rejects(readFile(path.join(root, 'public/.article-assets.json')), { code: 'ENOENT' });

  await syncArticles(root);
  assert.equal(
    await readFile(path.join(root, 'src/content/blog/second-post.md'), 'utf8'),
    [
      '# Second',
      '',
      '![Chart](../../articles/second-post/images/chart.svg)',
      '![Titled](../../articles/second-post/images/chart.svg "contains ]( marker")',
      '`![Example](images/chart.svg)`',
      '``![Example](images/chart.svg)``',
      '```md',
      '![Example](images/chart.svg)',
      '```',
      '````md',
      '```',
      '![Example](images/chart.svg)',
      '````',
      '    ![Example](images/chart.svg)',
      '`start',
      '![Example](images/chart.svg)',
      'end`',
      '> ```md',
      '> ![Example](images/chart.svg)',
      '> ```',
      'literal](images/chart.svg)',
      '![Space][space]',
      '',
      '[space]: <../../articles/second-post/images/my%20chart.svg>',
      '![Defined][foo\\]:bar]',
      '',
      '[foo\\]:bar]: ../../articles/second-post/images/chart.svg "title"',
      '![Encoded](../../articles/second-post/images/my%20chart.svg)',
      '![Hash](../../articles/second-post/images/foo%23bar.svg)',
      '![Percent](../../articles/second-post/100%25.svg)',
      '![Paren](../../articles/second-post/images/chart(1).svg)',
      '![Escaped](../../articles/second-post/images/chart(1).svg)',
      '',
    ].join('\n'),
  );
});

test('cleans only generated article projections and preserves unmanaged public files', async () => {
  const root = await fixture();
  await article(root, '2026-08-10-only-post', '# Current\n', { old: 'stale' });
  await writeFile(path.join(root, 'public/robots.txt'), 'static');
  await writeFile(path.join(root, 'public/post_img.webp'), 'legacy');
  await syncArticles(root);

  await rm(path.join(root, 'docs/2026-08-10-only-post/old'));
  await writeFile(path.join(root, 'docs/2026-08-10-only-post/new'), 'fresh');
  await syncArticles(root);

  await assert.rejects(
    readFile(path.join(root, 'public/articles/only-post/old')),
    { code: 'ENOENT' },
  );
  assert.equal(await readFile(path.join(root, 'public/articles/only-post/new'), 'utf8'), 'fresh');
  assert.equal(await readFile(path.join(root, 'public/robots.txt'), 'utf8'), 'static');
  assert.equal(await readFile(path.join(root, 'public/post_img.webp'), 'utf8'), 'legacy');
});

test('rejects every predictable invalid structure before changing projections', async (context) => {
  await context.test('top-level file', () => rejectsWithoutMutation(
    (root) => writeFile(path.join(root, 'docs/README.md'), '# Invalid\n'),
    /docs\/ may only contain article directories/,
  ));

  await context.test('invalid directory name', () => rejectsWithoutMutation(
    (root) => article(root, 'invalid-name'),
    /Invalid article directory name/,
  ));

  await context.test('missing canonical Markdown', () => rejectsWithoutMutation(
    async (root) => {
      const directory = path.join(root, 'docs/2026-08-10-wrong-name');
      await mkdir(directory);
      await writeFile(path.join(directory, 'article.md'), '# Wrong\n');
    },
    /exactly one canonical Markdown/,
  ));

  await context.test('additional Markdown', () => rejectsWithoutMutation(
    async (root) => {
      await article(root, '2026-08-10-extra-markdown');
      await writeFile(path.join(root, 'docs/2026-08-10-extra-markdown/notes.md'), '# Notes\n');
    },
    /exactly one canonical Markdown/,
  ));

  await context.test('duplicate generated slug', () => rejectsWithoutMutation(
    async (root) => {
      await article(root, '2026-08-09-same-slug');
      await article(root, '2026-08-10-same-slug');
    },
    /Generated article collision/,
  ));

  await context.test('symbolic link', () => rejectsWithoutMutation(
    async (root) => {
      await article(root, '2026-08-10-linked');
      await symlink(
        path.join(root, 'docs/2026-08-10-linked/2026-08-10-linked.md'),
        path.join(root, 'docs/2026-08-10-linked/link'),
      );
    },
    /Symbolic links are not allowed/,
  ));

  await context.test('symbolic link in a generated destination', async () => {
    const root = await fixture();
    const external = await mkdtemp(path.join(os.tmpdir(), 'pantagruel-external-'));
    await article(root, '2026-08-10-safe');
    await writeFile(path.join(external, 'sentinel'), 'untouched');
    await rm(path.join(root, 'public'), { recursive: true });
    await symlink(external, path.join(root, 'public'));

    await assert.rejects(syncArticles(root), /destination must be a real directory/);
    assert.equal(await readFile(path.join(external, 'sentinel'), 'utf8'), 'untouched');
  });
});
