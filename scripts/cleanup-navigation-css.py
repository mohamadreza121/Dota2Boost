from pathlib import Path

shell_path = Path("src/app/site-shell-v2.css")
shell = shell_path.read_text()
start_marker = "/* Forge Command Bar */"
end_marker = "/* Post-Match Command Center */"

if shell.count(start_marker) != 1 or shell.count(end_marker) != 1:
    raise RuntimeError("Navigation cleanup markers changed")

start = shell.index(start_marker)
end = shell.index(end_marker)
if start >= end:
    raise RuntimeError("Navigation cleanup marker order is invalid")

shell = shell[:start] + end_marker + shell[end + len(end_marker):]
shell_path.write_text(shell)

home_path = Path("src/app/war-table-home.css")
home = home_path.read_text()
legacy_override = '''@media (max-width: 430px) {
  body:has(.war-table) .dota-mobile-trigger {
    width: 46px;
    height: 46px;
  }

  body:has(.war-table) .dota-mobile-trigger svg { width: 16px; }
}

'''

if home.count(legacy_override) != 1:
    raise RuntimeError("Legacy homepage navigation override changed")

home_path.write_text(home.replace(legacy_override, ""))

if ".dota-command-header" in shell or ".dota-mobile-trigger" in shell:
    raise RuntimeError("Retired navigation CSS remains in the shell stylesheet")
if "body:has(.war-table) .dota-mobile-trigger" in home_path.read_text():
    raise RuntimeError("Retired homepage navigation override remains")
