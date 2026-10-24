"""Keep the Tetraedar company brand consistent in machine translations."""
import re

# Handle the Bulgarian brand and common transliteration mistakes from Argos.
_BRAND = re.compile(r"(?i)(?:ТЕТРАЕДЪР|Тетраедър|ТЕТРАЕДАР|Тетраедар|TETRAEDER|TETRAEDAR|Tetraeder|Tetraedar|Tetraedar|Tetraedar)")

def normalize_brand(value: str) -> str:
    def replace(match):
        word = match.group(0)
        return 'TETRAEDAR' if word.isupper() else 'Tetraedar'
    return _BRAND.sub(replace, value)

def translate_with_brand(text: str, translate_fn) -> str:
    # Give the translator the proper English spelling, then enforce it again on output.
    return normalize_brand(translate_fn(normalize_brand(text)))
