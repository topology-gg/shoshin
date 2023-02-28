# Introduction

The scripts in this folder were developped in order to facilitate the compilation of pure Cairo bytecode from steaming from a Starknet contract (written in Cairo).

# Script rules

The following rules need to be applied in order to allow the Starknet Cairo code to compile to a pure Cairo bytecode:

-   Remove all events emission.
-   Clean any Starknet decorator (e.g. @view, @external, %lang starknet).
-   Clean any Starknet specific implicit arguments (e.g. syscall_ptr).
-   Update contracts/lib imports.
-   Add the builtins to the entry file.

# Decorators

Additionally, the script allows the user to define, inside the Starknet Cairo code, decorators that will be applied during the execution of the script. The following decorators can be used:

-   // cairo -p xxxx: adds xxxx at the beginning of the next line.
-   // cairo -d: deletes the next line.
-   // cairo -D x: delete the next x instructions (each instruction is delimited by a semicolon).
-   // cairo -i xxxx: inserts xxxx on the below line.
-   // cairo --return (xxxx:type, yyyy: type): replaces the current functions return with (xxxx:type, yyyy: type).

These decorators allow for example to define a new return value for a function, replacing a previously used Starknet event.

# Files

The script execution is divided into the following files:

-   Makefile: central execution of the script, executes the compilation for the Starknet Cairo files and their dependencies (libraries). Some configuration available (dir, path, output, main) and takes care of cleaning.

-   compile_cairo.sh: launches the Starknet Cairo script clean up along with the following arguments: path to the compilation folder (e.g. cairo-test), name of the main entry file (e.g. engine for Shoshin) and path to the Starknet Cairo file to clean.

-   gencairo.py: cleans up according to [section on script rules](#script-rules) and executes the decorators from [section on decorators](#decorators).

-   compile_lib.sh: launches the Starknet Cairo dependencies script clean up along with the following arguments: path to the compilation folder, path to the Starknet Cairo dependencie file to clean.

-   genlib.py: cleans up according to [section on script rules](#script-rules) and stores all the dependencies inside the lib folder of the compilation folder (e.g. cairo-test/lib).
