"""Manual BG-to-EN translation corrections, keyed by exact Bulgarian source text.

When the Bulgarian source changes, its old override no longer matches and the
new source is translated normally. Other translations remain untouched.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OVERRIDES_FILE = ROOT / 'content' / 'en' / 'translation-overrides.json'


def load_overrides():
    if not OVERRIDES_FILE.exists():
        return {}
    data = json.loads(OVERRIDES_FILE.read_text(encoding='utf-8'))
    if not isinstance(data, dict) or any(not isinstance(k, str) or not isinstance(v, str) for k, v in data.items()):
        raise ValueError('translation-overrides.json must be a JSON object mapping Bulgarian text to English text')
    return data


def resolved_translation(source, cache, overrides, translate_new):
    # An explicit correction always wins over a cached machine translation.
    if source in overrides:
        return overrides[source], False
    if source not in cache:
        cache[source] = translate_new(source)
        return cache[source], True
    return cache[source], False
