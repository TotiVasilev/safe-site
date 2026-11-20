#!/usr/bin/env python3
"""Copy the matching, manually written language variant for newly duplicated CMS products.

Never translates text and never overwrites an existing product. If the original
cannot be identified confidently, it logs a warning and leaves the file alone.
"""
import difflib
import os
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
FOLDERS = {'bg': 'content/products', 'en': 'content/en/products'}
SLUG_LINE = re.compile(r'(?m)^(urlSlug:\s*)([^\r\n]*)(\r?)$')


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, text=True, stderr=subprocess.DEVNULL)


def original_text(revision, path):
    try:
        return git('show', f'{revision}:{path}')
    except subprocess.CalledProcessError:
        return None


def normalized(content):
    # Slug changes when duplicating. Keep all the other product content for matching.
    return SLUG_LINE.sub(r'\1<slug>\3', content).strip()


def slug_from_file(content, path):
    match = SLUG_LINE.search(content)
    return match.group(2).strip().strip('"\'') if match else Path(path).stem


def run(base, head):
    try:
        added = git('diff', '--diff-filter=A', '--name-only', base, head).splitlines()
    except subprocess.CalledProcessError as exc:
        raise RuntimeError('Unable to inspect the previous commit; no files changed') from exc

    created = []
    for new_path in added:
        language = next((lang for lang, folder in FOLDERS.items()
                         if new_path.startswith(folder + '/') and new_path.endswith('.md')), None)
        if language is None:
            continue
        opposite = 'en' if language == 'bg' else 'bg'
        new_file = ROOT / new_path
        if not new_file.is_file():
            continue
        content = new_file.read_text(encoding='utf-8')
        slug = slug_from_file(content, new_path)
        destination = ROOT / FOLDERS[opposite] / f'{slug}.md'
        if destination.exists():
            print(f'SKIP: {destination.relative_to(ROOT)} already exists')
            continue

        # Match against existing products *before* this commit, not other new files.
        candidates = []
        for old_path in git('ls-tree', '-r', '--name-only', base, '--', FOLDERS[language]).splitlines():
            if not old_path.endswith('.md') or old_path == new_path:
                continue
            counterpart = FOLDERS[opposite] + '/' + Path(old_path).name
            opposite_text = original_text(base, counterpart)
            if opposite_text is None:
                continue
            source_text = original_text(base, old_path)
            if source_text is None:
                continue
            score = difflib.SequenceMatcher(None, normalized(content), normalized(source_text), autojunk=False).ratio()
            candidates.append((score, old_path, opposite_text))

        candidates.sort(key=lambda row: row[0], reverse=True)
        if not candidates or candidates[0][0] < 0.82 or (len(candidates) > 1 and candidates[0][0] - candidates[1][0] < 0.035):
            print(f'WARNING: Could not confidently identify original for {new_path}; English/Bulgarian copy NOT created')
            continue
        score, source, counterpart_content = candidates[0]
        if not SLUG_LINE.search(counterpart_content):
            print(f'WARNING: Original counterpart has no urlSlug: {source}')
            continue
        new_counterpart = SLUG_LINE.sub(lambda m: m.group(1) + slug + m.group(3), counterpart_content, count=1)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(new_counterpart, encoding='utf-8')
        created.append(str(destination.relative_to(ROOT)))
        print(f'CREATED: {created[-1]} (duplicated from {source}, confidence {score:.3f})')
    return created


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('Usage: duplicate-bilingual-products.py BASE_COMMIT HEAD_COMMIT')
    created = run(sys.argv[1], sys.argv[2])
    if os.getenv('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a', encoding='utf-8') as out:
            out.write('created=' + ('true' if created else 'false') + '\n')
