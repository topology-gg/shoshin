import sys
import os
import re

new_folder = sys.argv[1]
file_path = os.getcwd() + '/' + sys.argv[3]
is_main = sys.argv[2] in file_path
new_path = file_path.replace("contracts", new_folder)

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

def clean_implicits(s: str):
    return re.sub(r"\{.*range_check_ptr\}", "{range_check_ptr}", s)

def update_imports(s: str):
    return re.sub(r"from contracts", f"from {new_folder}", s)

def update_libs(s: str):
    return re.sub(r"from lib.*\.(\w*) ", f"from {new_folder}.lib.\\1 ", s)

def apply_delete_line(s: str):
    return re.sub(r"\/\/ *cairo -d *\n.*", "", s)

def apply_delete_lines(s: str):
    for arg in re.findall(r"\/\/ * cairo -D (\w*)", s):
        s = re.sub(r"\/\/ * cairo -D (\w*) *(([\n \d\w=\(\),]*);){" + re.escape(arg) + r"}", "", s)
    return s

def apply_insert(s: str):
    return re.sub(r"\/\/ cairo -i *(.*)", r"\1", s)

def apply_push(s: str):
    return re.sub(r"\/\/ cairo -p *(.*) *\n *(.*)", r"\1 \2", s)

def apply_return(s: str):
    return re.sub(r"-> *\([\w\d\: ]*\) * { *\n *\/\/ * cairo --return *(.*)", r"-> \1 {", s)

f = [clean_events, clean_lang, clean_at, clean_emits, clean_implicits, update_imports, 
     update_libs, apply_delete_line, apply_delete_lines, apply_insert, apply_push, apply_return]
[cairo := x(cairo) for x in f]

if is_main:
    cairo = "%builtins range_check \n" + cairo

os.makedirs(os.path.dirname(new_path), exist_ok=True)
with open(new_path, 'w+') as f:
    f.write(cairo)