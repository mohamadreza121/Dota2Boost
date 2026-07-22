from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file_path = Path(path)
    text = file_path.read_text()
    if old not in text:
        raise RuntimeError(f"Expected source was not found in {path}: {old[:140]!r}")
    file_path.write_text(text.replace(old, new, 1))


css_path = "src/app/war-table-home.css"
replace_once(
    css_path,
    '  .war-hero__image { inset: auto 0 0; height: 48%; }',
    '  .war-hero__image { inset: 48rem 0 auto; height: 44rem; }',
)
replace_once(
    css_path,
    '  .war-hero .war-kicker strong { white-space: nowrap; }',
    '  .war-hero .war-kicker strong { min-width: 0; white-space: normal; overflow-wrap: anywhere; }',
)
replace_once(
    css_path,
    '.war-route-ready > span { line-height: 1.35; }',
    '.war-route-ready > span { line-height: 1.35; word-spacing: 0.18em; }',
)
replace_once(
    css_path,
    '@media (min-width: 1081px) and (max-height: 700px) {',
    '''@media (max-width: 350px) {
  .war-hero__inner { padding-top: 1.7rem; }
  .war-hero .war-kicker { margin-bottom: 0.6rem; }
  .war-hero__copy h1 { margin-bottom: 0.75rem; font-size: 3.25rem; }
  .war-hero__lead { margin-bottom: 0.55rem; font-size: 1rem; }
  .war-hero__body { line-height: 1.45; }
  .war-hero__actions { margin-top: 1rem; }
}

@media (min-width: 1081px) and (max-height: 700px) {''',
)
print("Final browser QA corrections completed.")
