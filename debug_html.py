import re

html = open("/Users/sidrameshwar./Desktop/SaaSIQ_UX/design/prototype/index.html").read()

# Find all dash-section elements, handle both attribute orderings
pat = re.compile(r'<div[^>]*id="(sec-[^"]+)"[^>]*class="dash-section|<div[^>]*class="dash-section[^"]*"[^>]*id="(sec-[^"]+)"')
sections = []
for m in pat.finditer(html):
    sid = m.group(1) or m.group(2)
    sections.append((sid, m.start()))

print(f"Found {len(sections)} sections\n")

for i, (sid, start) in enumerate(sections):
    end = sections[i+1][1] if i+1 < len(sections) else len(html)
    chunk = html[start:end]
    opens = len(re.findall(r"<div\b", chunk))
    closes = len(re.findall(r"</div>", chunk))
    bal = opens - closes
    flag = " <<< IMBALANCED" if bal != 0 else ""
    print(f"{sid:25s} divs: +{opens} -{closes} = {bal:+d}{flag}")

# Check overall balance from main-content
main_idx = html.find('class="main-content"')
after_main = html[main_idx:]
total_opens = len(re.findall(r"<div\b", after_main))
total_closes = len(re.findall(r"</div>", after_main))
print(f"\nOverall after main-content: +{total_opens} opens, -{total_closes} closes = {total_opens-total_closes:+d}")

# Check for the topbar
topbar_idx = html.find('class="topbar"')
topbar_end = html.find('</div>', html.find('</div>', html.find('</div>', topbar_idx) + 1) + 1)
print(f"\nTopbar found at char {topbar_idx}")

# Check what element is at the very end of page-dashboard
page_dash_start = html.find('id="page-dashboard"')
# Find closing for page-dashboard by tracking tags
lines = html.split('\n')
for i, line in enumerate(lines):
    if 'page-dashboard' in line:
        print(f"\npage-dashboard at line {i+1}: {line.strip()[:80]}")
    if 'app-shell' in line:
        print(f"app-shell at line {i+1}: {line.strip()[:80]}")
