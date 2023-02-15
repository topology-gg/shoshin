import sys
import os
import re

new_folder = sys.argv[1]
file_path = os.getcwd() + '/' + sys.argv[2]
new_path = new_folder + '/' + os.path.basename(file_path)
new_import = ""
[new_import := new_import + x + "." for x in new_path.split('/')[-3:-1]]

with open(file_path) as f:
    cairo = f.read()

def clean_events(s: str):
    return re.sub(r"@event[\s\S]*{[\s\S]*}", "", s)

def clean_lang(s: str):
    return re.sub(r"%lang starknet", "", s)

def clean_at(s: str):
    return re.sub(r"@.*", "", s)

def clean_emits(s: str):
    return re.sub(r".*emit.*", "", s)

def update_imports(s: str):
    return re.sub(r"from lib\.([\w\.]*) *import", f"from {new_import}\\1 import", s)

f = [clean_events, clean_lang, clean_at, clean_emits, update_imports]
[cairo := x(cairo) for x in f]

os.makedirs(os.path.dirname(new_path), exist_ok=True)
with open(new_path, 'w+') as f:
    f.write(cairo)