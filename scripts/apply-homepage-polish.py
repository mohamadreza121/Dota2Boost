from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file_path = Path(path)
    text = file_path.read_text()
    if old not in text:
        raise RuntimeError(f"Expected source was not found in {path}: {old[:120]!r}")
    file_path.write_text(text.replace(old, new, 1))


def replace_all(path: str, old: str, new: str, expected: int) -> None:
    file_path = Path(path)
    text = file_path.read_text()
    count = text.count(old)
    if count != expected:
        raise RuntimeError(f"Expected {expected} occurrences in {path}, found {count}: {old!r}")
    file_path.write_text(text.replace(old, new))


replace_once(
    "src/app/layout.tsx",
    'className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition focus:translate-y-0"',
    'className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition focus-visible:translate-y-0"',
)
replace_once(
    "src/app/layout.tsx",
    '<main id="main-content">{children}</main>',
    '<main id="main-content" tabIndex={-1}>{children}</main>',
)
replace_once("src/app/page.tsx", 'import "./war-table-legibility.css";\n', "")

replace_once(
    "src/components/home/war-table-home.tsx",
    '  weight: ["600", "700"],\n',
    "",
)
replace_once(
    "src/components/home/war-table-home.tsx",
    '  weight: ["400", "500", "600", "700"],\n',
    "",
)
replace_once(
    "src/components/home/war-table-hero.tsx",
    '<p className="war-kicker"><span>Campaign 01</span><i /> The Dire War Table</p>',
    '<p className="war-kicker"><span>Campaign 01</span><i /><strong>The Dire War Table</strong></p>',
)
replace_once(
    "src/components/home/rank-route-preview.tsx",
    '<span className="war-route-ready"><Check aria-hidden="true" /> Scope visible before payment</span>',
    '<span className="war-route-ready"><Check aria-hidden="true" /><span>Scope visible before payment</span></span>',
)
replace_once(
    "scripts/visual-qa.mjs",
    'document.querySelector("[data-home-reveal]")',
    'document.querySelector("[data-war-reveal]")',
)

css_path = "src/app/war-table-home.css"
replace_once(
    css_path,
    '.war-kicker span { color: var(--war-gold); }\n.war-kicker i {',
    '.war-kicker span { color: var(--war-gold); }\n.war-kicker strong { color: inherit; font: inherit; }\n.war-kicker i {',
)
replace_once(
    css_path,
    '.war-heading__aside svg { width: 1rem; }\n\n.war-section { position: relative; z-index: 1; padding-block: clamp(6rem, 10vw, 10rem); }',
    '.war-heading__aside svg { width: 1rem; }\n.war-heading__aside > a { min-height: 2.75rem; }\n\n.war-section { position: relative; z-index: 1; padding-block: clamp(6rem, 10vw, 10rem); scroll-margin-top: calc(var(--header-height) + 1rem); }',
)
replace_all(
    css_path,
    'min-height: max(47rem, calc(100svh - var(--header-height)));',
    'min-height: max(39rem, calc(100svh - var(--header-height)));',
    2,
)
replace_once(
    css_path,
    '.war-route-ready { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--war-mint); font-size: 0.72rem; font-weight: 600; }\n.war-route-ready svg { width: 0.9rem; }',
    '.war-route-ready { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--war-mint); font-size: 0.72rem; font-weight: 600; }\n.war-route-ready > span { line-height: 1.35; }\n.war-route-ready svg { width: 0.9rem; flex: 0 0 auto; }',
)
replace_once(
    css_path,
    '.war-contract-row__copy em { overflow: hidden; margin-top: 0.3rem; color: var(--war-ash); font-size: 0.76rem; font-style: normal; text-overflow: ellipsis; white-space: nowrap; }',
    '.war-contract-row__copy em { margin-top: 0.3rem; color: var(--war-ash); font-size: 0.76rem; font-style: normal; line-height: 1.45; }',
)
replace_once(
    css_path,
    '.war-featured-specialist > a { display: inline-flex; align-items: center;',
    '.war-featured-specialist > a { display: inline-flex; min-height: 2.75rem; align-items: center;',
)
replace_once(
    css_path,
    '.war-record__proof > a { display: inline-flex; align-items: center;',
    '.war-record__proof > a { display: inline-flex; min-height: 2.75rem; align-items: center;',
)
replace_once(css_path, '@media (max-width: 980px) {', '@media (max-width: 1080px) {')
replace_once(
    css_path,
    '.war-hero__inner { display: block; padding: 4.6rem 1rem 3rem; }',
    '.war-hero__inner { display: block; padding: 3rem 1rem 3rem; }',
)
replace_once(
    css_path,
    '.war-hero__body { font-size: 0.96rem; }',
    '.war-hero__body { font-size: 1rem; }',
)
replace_once(
    css_path,
    '''  .war-route-preview__medals { grid-template-columns: 1fr; gap: 0.65rem; }
  .war-route-track { width: 8rem; min-height: 4.4rem; margin-inline: auto; transform: rotate(90deg); }
  .war-route-track__count { transform: rotate(-90deg) translate(1.7rem, 2.3rem); }
  .war-route-track__marker { top: 45%; }
  .war-route-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .war-route-controls label:last-child { grid-column: 1 / -1; }''',
    '''  .war-route-preview__medals { grid-template-columns: minmax(4.5rem, 0.72fr) minmax(6.5rem, 1fr) minmax(4.5rem, 0.72fr); align-items: start; gap: 0.45rem; }
  .war-route-medal img { width: clamp(3.7rem, 16vw, 5rem); }
  .war-route-medal strong { font-size: 0.8rem; }
  .war-route-track { width: auto; min-height: 5.4rem; margin-inline: 0; transform: none; }
  .war-route-track__count { bottom: -0.1rem; transform: none; }
  .war-route-track__marker { top: 42%; }
  .war-route-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .war-route-controls label:last-child { grid-column: 1 / -1; }''',
)
replace_once(
    css_path,
    '''  .war-hero__inner { padding-inline: 0.9rem; }
  .war-hero__copy h1 { font-size: clamp(3.7rem, 18vw, 4.8rem); }
  .war-route-controls { grid-template-columns: 1fr; }
  .war-route-controls label:last-child { grid-column: auto; }
  .war-route-preview__head { align-items: flex-start; flex-direction: column; gap: 0.25rem; }''',
    '''  .war-hero__inner { padding-inline: 0.9rem; }
  .war-hero .war-kicker { display: grid; grid-template-columns: auto minmax(1rem, 1fr) auto; gap: 0.5rem; letter-spacing: 0.1em; }
  .war-hero .war-kicker i { width: 100%; }
  .war-hero .war-kicker strong { white-space: nowrap; }
  .war-hero__copy h1 { max-width: none; font-size: min(16.5vw, 4.5rem); letter-spacing: -0.055em; line-height: 0.86; }
  .war-route-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .war-route-controls label:last-child { grid-column: 1 / -1; }
  .war-route-preview__head { align-items: flex-start; flex-direction: column; gap: 0.25rem; }
  .war-route-preview__footer { gap: 0.75rem; }''',
)

legibility_block = '''/* Tactical type floor ------------------------------------------------------ */

.war-table :is(
  small,
  dt,
  .war-kicker,
  .war-route-preview__head > span,
  .war-route-medal > span,
  .war-route-track__count,
  .war-route-controls label > span,
  .war-route-ready,
  .war-brief__head,
  .war-contract-primary__top > span,
  .war-contract-primary__body > p,
  .war-contract-primary footer p > span,
  .war-contract-row__number,
  .war-contract-row__copy small,
  .war-contract-row__copy em,
  .war-contract-row__price small,
  .war-protocol__number,
  .war-protocol__label,
  .war-workspace__bar > p,
  .war-workspace__summary small,
  .war-workspace__timeline small,
  .war-workspace__channel-head small,
  .war-message > span,
  .war-message strong,
  .war-message small,
  .war-featured-specialist__identity > div small,
  .war-featured-specialist dt,
  .war-roster-alternatives small,
  .war-roster-alternatives em,
  .war-record__proof-head,
  .war-record blockquote span,
  .war-record__proof li small,
  .war-final__target-head,
  .war-final__route span
) { font-size: 0.75rem; }

'''
replace_once(
    css_path,
    '/* Responsive -------------------------------------------------------------- */',
    legibility_block + '/* Responsive -------------------------------------------------------------- */',
)

height_block = '''@media (min-width: 1081px) and (max-height: 700px) {
  .war-hero,
  .war-hero__inner { min-height: calc(100svh - var(--header-height)); }
  .war-hero__inner { padding-block: 2.4rem 1.5rem; }
  .war-hero__copy { padding-bottom: 1.25rem; }
  .war-hero__copy h1 { font-size: clamp(4rem, 6vw, 6.4rem); }
  .war-hero__body { line-height: 1.55; }
  .war-hero__trust > div { min-height: 4.7rem; }
}

@media (max-width: 900px) and (max-height: 500px) and (orientation: landscape) {
  .war-hero__inner { padding: 1.5rem 1.5rem 2.5rem; }
  .war-hero__copy { max-width: 34rem; }
  .war-hero .war-kicker { margin-bottom: 0.55rem; }
  .war-hero__copy h1 { margin-bottom: 0.7rem; font-size: 3rem; line-height: 0.86; }
  .war-hero__lead { margin-bottom: 0.45rem; font-size: 1rem; }
  .war-hero__body { font-size: 0.88rem; line-height: 1.45; }
  .war-hero__actions { display: flex; margin-top: 0.9rem; }
  .war-hero__actions .war-action-button { width: auto; }
  .war-hero__console { margin-top: 2rem; }
}

'''
replace_once(css_path, '@media (hover: none) {', height_block + '@media (hover: none) {')

Path("src/app/war-table-legibility.css").unlink()
print("Homepage polish transformations completed.")
