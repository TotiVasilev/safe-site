#!/usr/bin/env python3
"""Translate Bulgarian CMS homepage text into a saved English JSON file using Argos Translate.
Run locally or via the manual GitHub Actions workflow. No paid translation API.
"""
import json, os, sys
from pathlib import Path
import argostranslate.package
import argostranslate.translate
from brand_terms import normalize_brand, translate_with_brand

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'content' / 'homepage.json'
TARGET = ROOT / 'content' / 'en' / 'homepage.json'
CACHE = ROOT / 'content' / 'en' / 'translation-cache.json'
TRANSLATE_KEYS = {
    'heroTitle','heroDescription','primaryButton','secondaryButton',
    'aboutLabel','aboutTitle','aboutParagraph1','aboutParagraph2',
    'feature1Title','feature1Description','feature2Title','feature2Description',
    'feature3Title','feature3Description','partnersLabel','partnersTitle',
    'partnersDescription','productsLabel','productsTitle','productsDescription',
    'featuredTitle','featuredDescription','catalogButton','catalogLabel',
    'catalogTitle','catalogDescription','servicesLabel','servicesTitle',
    'servicesDescription','servicesButton','contactLabel','contactTitle',
    'contactDescription','contactButton','pointerLeft','pointerRight'
}

def install_model():
    installed = argostranslate.translate.get_installed_languages()
    bg = next((x for x in installed if x.code == 'bg'), None)
    if bg and any(t.to_lang.code == 'en' for t in bg.translations):
        return
    argostranslate.package.update_package_index()
    available = argostranslate.package.get_available_packages()
    direct = next((p for p in available if p.from_code == 'bg' and p.to_code == 'en'), None)
    if not direct:
        raise RuntimeError('No Bulgarian-to-English Argos model is available. No files were changed.')
    argostranslate.package.install_from_path(direct.download())

def main():
    install_model()
    original = json.loads(SOURCE.read_text(encoding='utf-8'))
    old_cache = json.loads(CACHE.read_text(encoding='utf-8')) if CACHE.exists() else {}
    old_cache = {k: normalize_brand(v) if isinstance(v, str) else v for k, v in old_cache.items()}
    translated = dict(original)
    new_cache = dict(old_cache)
    changed = 0
    for key in TRANSLATE_KEYS:
        value = original.get(key)
        if not isinstance(value, str) or not value.strip():
            continue
        # Cache by exact Bulgarian source text: unchanged CMS fields don't get retranslated.
        if value not in new_cache:
            new_cache[value] = translate_with_brand(value, lambda text: argostranslate.translate.translate(text, 'bg', 'en'))
            changed += 1
        translated[key] = normalize_brand(new_cache[value])
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    TARGET.write_text(json.dumps(translated, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    CACHE.write_text(json.dumps(new_cache, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'English homepage saved to {TARGET.relative_to(ROOT)}; translated {changed} new fields.')

if __name__ == '__main__':
    main()
