.PHONY: clean cairo-compile
dir?=8-zed
path?=cairo_test
output_shoshin?=compiled_shoshin.json
output_bto?=compiled_bto.json
main_shoshin?=engine.cairo
main_bto?=bto.cairo

cairo_files := $(shell find $(dir) -name "*.cairo" -path "*/contracts/*")
lib_files := $(shell find $(dir) -name "*.cairo" -path "*/lib/*")

# In order to correctly build the starnet cairo file to a pure cairo file, the
# following annotations can be done in the starknet code using comments:
# - // cairo -p xxxx: adds xxxx at the beginning of the next line.
# - // cairo -d: deletes the next line.
# - // cairo -i xxxx: inserts xxxx on the below line.
# - // cairo --return (xxxx:type, yyyy: type): replaces the current functions return with (xxxx:type, yyyy: type).
# 	Must be placed under the return line.

all: cairo-compile-shoshin cairo-compile-lib clean

cairo-build: prepare
	sh ./scripts/compile_cairo.sh $(path) $(main_shoshin) $(cairo_files) 

lib-build: prepare
	sh ./scripts/compile_lib.sh $(PWD)/$(dir)/$(path)/lib $(lib_files)
	sh ./scripts/build_lib.sh $(PWD)/$(dir)/$(path)/lib/$(main_bto)

cairo-compile-shoshin: cairo-build lib-build format
	cd $(dir) && \
	cairo-compile $(path)/$(main_shoshin) --output $(output_shoshin) && \
	mv $(output_shoshin) ../

cairo-compile-lib: cairo-build lib-build format
	cd $(dir) && \
	cairo-compile $(path)/lib/$(main_bto) --output $(output_bto) && \
	mv $(output_bto) ../

format: cairo-build lib-build
	$(eval TEMP_CAIRO_FILES = $(shell find $(dir) -name "*.cairo" -path "*/$(path)/*")) \
	cairo-format -i $(TEMP_CAIRO_FILES)

clean: cairo-compile-shoshin cairo-compile-lib
	rm -rf $(dir)/$(path)

prepare: 
	mkdir -p $(dir)/$(path)