import { fileURLToPath } from 'node:url';
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const ARTICLE_DIRECTORY = /^\d{4}-\d{2}-\d{2}-([a-z0-9]+(?:-[a-z0-9]+)*)$/;

function projectedDestination(destination, slug, attachmentPaths) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(destination)) {
    return null;
  }

  const match = /^([^?#]*)([?#].*)?$/.exec(destination);
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(match[1]);
  } catch {
    decodedPath = match[1];
  }
  const relativePath = decodedPath.replace(/^\.\//, '');
  const normalizedPath = path.posix.normalize(relativePath);
  if (!attachmentPaths.has(normalizedPath)) {
    return null;
  }

  const encodedPath = normalizedPath.split('/').map(encodeURIComponent).join('/');
  return `../../articles/${slug}/${encodedPath}${match[2] ?? ''}`;
}

function markdownDestinationRange(source, type) {
  const delimiter = type === 'definition' ? ']:' : '](';
  let delimiterIndex = -1;
  if (type === 'definition') {
    for (let index = 1; index < source.length; index += 1) {
      if (source[index] === '\\') index += 1;
      else if (source.startsWith(delimiter, index)) {
        delimiterIndex = index;
        break;
      }
    }
  } else {
    let depth = 0;
    for (let index = source.startsWith('![') ? 2 : 1; index < source.length; index += 1) {
      if (source[index] === '\\') index += 1;
      else if (source[index] === '[') depth += 1;
      else if (source[index] === ']' && depth > 0) depth -= 1;
      else if (source.startsWith(delimiter, index)) {
        delimiterIndex = index;
        break;
      }
    }
  }
  if (delimiterIndex === -1) {
    throw new Error('Cannot locate Markdown attachment delimiter');
  }
  let start = delimiterIndex + delimiter.length;
  while (/\s/.test(source[start] ?? '')) start += 1;

  if (source[start] === '<') {
    start += 1;
    let end = start;
    while (end < source.length) {
      if (source[end] === '\\') end += 2;
      else if (source[end] === '>') return { start, end };
      else end += 1;
    }
  } else {
    let end = start;
    let depth = 0;
    while (end < source.length) {
      const character = source[end];
      if (character === '\\') {
        end += 2;
        continue;
      }
      if (character === '(') depth += 1;
      else if (character === ')') {
        if (type !== 'definition' && depth === 0) return { start, end };
        depth -= 1;
      } else if (/\s/.test(character) && depth === 0) {
        return { start, end };
      }
      end += 1;
    }
    return { start, end };
  }

  throw new Error('Cannot locate Markdown attachment destination');
}

function projectAttachmentReferences(markdown, slug, attachments) {
  const attachmentPaths = new Set(attachments);
  const tree = unified().use(remarkParse).parse(markdown);
  const replacements = [];

  function collect(node) {
    if (['image', 'link', 'definition'].includes(node.type)) {
      const projected = projectedDestination(node.url, slug, attachmentPaths);
      if (projected) {
        const start = node.position.start.offset;
        const end = node.position.end.offset;
        const source = markdown.slice(start, end);
        const destination = markdownDestinationRange(source, node.type);
        replacements.push({
          start: start + destination.start,
          end: start + destination.end,
          value: projected,
        });
      }
    }
    for (const child of node.children ?? []) collect(child);
  }

  collect(tree);
  return replacements
    .sort((left, right) => right.start - left.start)
    .reduce(
      (projected, replacement) => projected.slice(0, replacement.start)
        + replacement.value
        + projected.slice(replacement.end),
      markdown,
    );
}

async function existingEntry(target) {
  try {
    return await lstat(target);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function assertSafeDirectoryChain(root, relativePath) {
  let current = root;
  for (const segment of relativePath.split('/')) {
    current = path.join(current, segment);
    const entry = await existingEntry(current);
    if (!entry) return;
    if (entry.isSymbolicLink() || !entry.isDirectory()) {
      throw new Error(`Generated article destination must be a real directory: ${relativePath}`);
    }
  }
}

async function replaceProjections(root, blogDirectory, articleAssetsDirectory, preparedBlog, preparedAssets) {
  await assertSafeDirectoryChain(root, 'src/content/blog');
  await assertSafeDirectoryChain(root, 'public/articles');
  await mkdir(path.dirname(blogDirectory), { recursive: true });
  await mkdir(path.dirname(articleAssetsDirectory), { recursive: true });

  const transaction = path.dirname(preparedBlog);
  const previousBlog = path.join(transaction, 'previous-blog');
  const previousAssets = path.join(transaction, 'previous-assets');
  const hadBlog = Boolean(await existingEntry(blogDirectory));
  const hadAssets = Boolean(await existingEntry(articleAssetsDirectory));

  try {
    if (hadBlog) await rename(blogDirectory, previousBlog);
    if (hadAssets) await rename(articleAssetsDirectory, previousAssets);
    await rename(preparedBlog, blogDirectory);
    await rename(preparedAssets, articleAssetsDirectory);
  } catch (error) {
    await rm(blogDirectory, { recursive: true, force: true });
    await rm(articleAssetsDirectory, { recursive: true, force: true });
    if (hadBlog && await existingEntry(previousBlog)) await rename(previousBlog, blogDirectory);
    if (hadAssets && await existingEntry(previousAssets)) await rename(previousAssets, articleAssetsDirectory);
    throw error;
  } finally {
    await rm(transaction, { recursive: true, force: true });
  }
}

async function filesBelow(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0)) {
    const relativePath = path.posix.join(prefix, entry.name);
    const absolutePath = path.join(directory, entry.name);

    if (entry.isSymbolicLink()) {
      throw new Error(`Symbolic links are not allowed in article directories: ${relativePath}`);
    }
    if (entry.isDirectory()) {
      files.push(...await filesBelow(absolutePath, relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    } else {
      throw new Error(`Unsupported article entry: ${relativePath}`);
    }
  }

  return files;
}

export async function syncArticles(rootDirectory = process.cwd()) {
  const root = path.resolve(rootDirectory);
  const docsDirectory = path.join(root, 'docs');
  const blogDirectory = path.join(root, 'src', 'content', 'blog');
  const articleAssetsDirectory = path.join(root, 'public', 'articles');
  const entries = await readdir(docsDirectory, { withFileTypes: true });
  const articles = [];

  for (const entry of entries.sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0)) {
    if (!entry.isDirectory()) {
      throw new Error(`docs/ may only contain article directories: ${entry.name}`);
    }

    const match = ARTICLE_DIRECTORY.exec(entry.name);
    if (!match) {
      throw new Error(`Invalid article directory name: ${entry.name}`);
    }

    const articleDirectory = path.join(docsDirectory, entry.name);
    const markdownName = `${entry.name}.md`;
    const articleFiles = await filesBelow(articleDirectory);
    const markdownFiles = articleFiles.filter((file) => path.extname(file).toLowerCase() === '.md');

    if (markdownFiles.length !== 1 || markdownFiles[0] !== markdownName) {
      throw new Error(
        `Article ${entry.name} must contain exactly one canonical Markdown named ${markdownName}`,
      );
    }

    const slug = match[1];
    const outputName = `${slug}.md`;
    if (articles.some((article) => article.outputName === outputName)) {
      throw new Error(`Generated article collision: ${outputName}`);
    }
    articles.push({
      markdown: await readFile(path.join(articleDirectory, markdownName), 'utf8'),
      outputName,
      slug,
      attachments: await Promise.all(articleFiles
        .filter((file) => file !== markdownName)
        .map(async (relativePath) => ({
          relativePath,
          content: await readFile(path.join(articleDirectory, ...relativePath.split('/'))),
        }))),
    });
  }

  await assertSafeDirectoryChain(root, 'src/content/blog');
  await assertSafeDirectoryChain(root, 'public/articles');
  const transaction = await mkdtemp(path.join(root, '.article-sync-'));
  const preparedBlog = path.join(transaction, 'blog');
  const preparedAssets = path.join(transaction, 'articles');
  try {
    await mkdir(preparedBlog);
    await mkdir(preparedAssets);

    for (const article of articles) {
      const projectedMarkdown = projectAttachmentReferences(
        article.markdown,
        article.slug,
        article.attachments.map(({ relativePath }) => relativePath),
      );
      await writeFile(path.join(preparedBlog, article.outputName), projectedMarkdown);
      for (const { relativePath, content } of article.attachments) {
        const target = path.join(preparedAssets, article.slug, ...relativePath.split('/'));
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, content);
      }
    }

    await replaceProjections(
      root,
      blogDirectory,
      articleAssetsDirectory,
      preparedBlog,
      preparedAssets,
    );
  } finally {
    await rm(transaction, { recursive: true, force: true });
  }

  return {
    articles: articles.length,
    assets: articles.reduce((total, article) => total + article.attachments.length, 0),
  };
}

const invokedPath = process.argv[1] && path.resolve(process.argv[1]);
if (invokedPath === fileURLToPath(import.meta.url)) {
  const rootArgument = process.argv.indexOf('--root');
  const root = rootArgument === -1 ? process.cwd() : process.argv[rootArgument + 1];
  if (!root) {
    console.error('Usage: node scripts/sync-articles.mjs [--root <directory>]');
    process.exitCode = 1;
  } else {
    syncArticles(root)
      .then(({ articles, assets }) => {
        console.log(`Synchronized ${articles} article(s) and ${assets} attachment(s).`);
      })
      .catch((error) => {
        console.error(`Article synchronization failed: ${error.message}`);
        process.exitCode = 1;
      });
  }
}
