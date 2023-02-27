.PHONY: clean cairo-compile
dir?=8-zed
path?=cairo_test
output?=compiled.json
main?=engine.cairo

cairo_files := $(shell find $(dir) -name "*.cairo" -path "*/contracts/*")
lib_files := $(shell find $(dir) -name "*.cairo" -path "*/lib/*")

# In order to correctly build the starnet cairo file to a pure cairo file, the
# following annotations can be done in the starknet code using comments:
# - // cairo -p xxxx: adds xxxx at the beginning of the next line.
# - // cairo -d: deletes the next line.
# - // cairo -i xxxx: inserts xxxx on the below line.
# - // cairo --return (xxxx:type, yyyy: type): replaces the current functions return with (xxxx:type, yyyy: type).
# 	Must be placed under the return line.

all: cairo-compile clean

cairo-build: prepare
	sh ./scripts/compile_cairo.sh $(path) $(main) $(cairo_files) 

lib-build: prepare
	sh ./scripts/compile_lib.sh $(PWD)/$(dir)/$(path)/lib $(lib_files)

cairo-compile: cairo-build lib-build format
	cd $(dir) && \
	cairo-compile $(path)/$(main) --output $(output) && \
	mv $(output) ../

format: cairo-build lib-build
	$(eval TEMP_CAIRO_FILES = $(shell find $(dir) -name "*.cairo" -path "*/$(path)/*")) \
	cairo-format -i $(TEMP_CAIRO_FILES)

clean: cairo-compile
	rm -rf $(dir)/$(path)

prepare: 
	mkdir -p $(dir)/$(path)