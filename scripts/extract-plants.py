#!/usr/bin/env python3
"""
Extract plant data from Texas vegetable gardening PDFs.
Writes raw text to src/data/plants-raw.txt for manual review.
Usage: python scripts/extract-plants.py
"""
import sys
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    sys.exit("Run: .venv/bin/pip install pdfplumber")

ROOT = Path(__file__).parent.parent
PDFS = [
    ROOT / "docs" / "EHT-077-texas-home-vegetable-gardening-guide.pdf",
    ROOT / "docs" / "VegetableGardenPlantingGuide-Jan2025-English.pdf",
]
RAW_OUT = ROOT / "src" / "data" / "plants-raw.txt"


def extract_text(pdf_path: Path) -> str:
    lines = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                lines.append(text)
            for table in page.extract_tables():
                for row in table:
                    if row:
                        lines.append("\t".join(str(c or "") for c in row))
    return "\n".join(lines)


def main():
    RAW_OUT.parent.mkdir(parents=True, exist_ok=True)
    combined = []
    for pdf in PDFS:
        if not pdf.exists():
            print(f"WARNING: {pdf} not found, skipping")
            continue
        print(f"Extracting {pdf.name}...")
        text = extract_text(pdf)
        combined.append(f"=== {pdf.name} ===\n{text}")

    raw = "\n\n".join(combined)
    RAW_OUT.write_text(raw, encoding="utf-8")
    print(f"\nRaw text written to {RAW_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
