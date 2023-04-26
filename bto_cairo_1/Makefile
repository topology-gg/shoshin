COMPILE_ENTRYPOINT=lib/lib.cairo
OUTPUT_FILE=build/compiled_lib.sierra
FORMAT_ENTRYPOINT=lib
TEST_ENTRYPOINT=.

.PHONY: all

all: format test compile

compile:
	cairo-compile $(COMPILE_ENTRYPOINT) $(OUTPUT_FILE)

format: 
	cairo-format -r $(FORMAT_ENTRYPOINT)

test:
	cairo-test $(TEST_ENTRYPOINT)

