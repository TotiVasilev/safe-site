#!/usr/bin/env python3
"""Translate CMS source files into content/en/ using free Argos Translate.
Only changed Bulgarian strings are translated. URLs, IDs, model data and media are retained.
"""
import json
import re
from pathlib import Path
import yaml
import argostranslate.package
import argostranslate.translate
from brand_terms import normalize_brand, translate_with_brand
from translation_overrides import load_overrides, resolved_translation

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'content'
EN = CONTENT / 'en'
CACHE_FILE = EN / 'translation-cache.json'
JSON_FIELDS = {
    'homepage.json': None,  # all prose strings except structural keys below
    'services.json': None,
    'header.json': {'locationLabel'},
    'site-footer.json': {'privacyLabel'},
    'privacy-policy.json': {'title', 'content'},
}
STRUCTURAL = {'image', 'images', 'url', 'mapsUrl', 'address', 'email', 'phone', 'href', 'link', 'primaryLink', 'secondaryLink', 'contactLink', 'heroBackground', 'lastUpdated', 'date', 'id', 'slug', 'order', 'category', 'subcategory', 'file', 'modelDrawing', 'dimensions', 'width', 'height', 'depth', 'weight', 'volume', 'resistance', 'internalDimensions', 'innerHeight', 'innerWidth', 'innerDepth', 'urlSlug', 'lockCollection'}
MD_TEXT = {'title', 'description', 'catalogDescription', 'cardLabel', 'name', 'phrase'}
CYRILLIC = re.compile(r'[\u0400-\u04ff]')
URL = re.compile(r'^(?:https?://|/|mailto:|tel:|#[\w-]+)')

def ensure_model():
    installed = argostranslate.translate.get_installed_languages()
    bg = next((x for x in installed if x.code == 'bg'), None)
    if bg and any(x.to_lang.code == 'en' for x in bg.translations):
        return
    argostranslate.package.update_package_index()
    packages = argostranslate.package.get_available_packages()
    pkg = next((p for p in packages if p.from_code == 'bg' and p.to_code == 'en'), None)
    if not pkg:
        raise RuntimeError('No Argos Bulgarian-English translation model available')
    argostranslate.package.install_from_path(pkg.download())

def main():
    EN.mkdir(exist_ok=True)
    cache = json.loads(CACHE_FILE.read_text(encoding='utf8')) if CACHE_FILE.exists() else {}
    cache = {k: normalize_brand(v) if isinstance(v, str) else v for k, v in cache.items()}
    overrides = load_overrides()
    added = 0
    def translate(s):
        nonlocal added
        if not isinstance(s, str) or not CYRILLIC.search(s) or URL.match(s.strip()):
            return s
        result, is_new = resolved_translation(
            s, cache, overrides,
            lambda value: translate_with_brand(value, lambda text: argostranslate.translate.translate(text, 'bg', 'en'))
        )
        added += int(is_new)
        return normalize_brand(result)
    def transform(obj, key=None, allowed=None):
        if isinstance(obj, dict):
            return {k: transform(v, k, allowed) for k, v in obj.items()}
        if isinstance(obj, list):
            return [transform(v, key, allowed) for v in obj]
        if isinstance(obj, str) and key not in STRUCTURAL and (allowed is None or key in allowed):
            return translate(obj)
        return obj
    for name, allowed in JSON_FIELDS.items():
        source = CONTENT / name
        if not source.exists():
            continue
        data = json.loads(source.read_text(encoding='utf8'))
        translated = transform(data, allowed=allowed)
        (EN / name).write_text(json.dumps(translated, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    for folder in ('categories', 'subcategories', 'products'):
        for source in sorted((CONTENT / folder).glob('*.md')):
            raw = source.read_text(encoding='utf8')
            match = re.match(r'\A---\s*\n(.*?)\n---\s*\n?', raw, re.S)
            if not match:
                continue
            data = yaml.safe_load(match.group(1)) or {}
            # Preserve slugs, image paths, technical specifications and model names.
            translated = transform(data, allowed=MD_TEXT)
            body = raw[match.end():]
            # Translate prose per paragraph, leaving Markdown markers intact.
            chunks = re.split(r'(\n\s*\n)', body)
            for i, chunk in enumerate(chunks):
                if CYRILLIC.search(chunk):
                    chunks[i] = translate(chunk)
            target = EN / folder / source.name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text('---\n' + yaml.safe_dump(translated, allow_unicode=True, sort_keys=False, width=120) + '---\n' + ''.join(chunks), encoding='utf8')
    CACHE_FILE.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    print(f'Translation complete: {added} new strings; output in content/en/')

if __name__ == '__main__':
    ensure_model()
    main()
