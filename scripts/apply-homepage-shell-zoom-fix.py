from pathlib import Path

path = Path("src/app/war-table-home.css")
text = path.read_text()
anchor = "@media (max-width: 350px) {"
insert = '''@media (max-width: 430px) {
  body:has(.war-table) .dota-mobile-trigger {
    width: 46px;
    height: 46px;
  }

  body:has(.war-table) .dota-mobile-trigger svg { width: 16px; }
}

'''
if insert in text:
    raise RuntimeError("Homepage header zoom compatibility rule already exists.")
if anchor not in text:
    raise RuntimeError("Expected mobile QA anchor was not found.")
path.write_text(text.replace(anchor, insert + anchor, 1))
print("Homepage header zoom compatibility correction completed.")
