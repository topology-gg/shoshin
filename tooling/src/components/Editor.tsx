import React, { useRef } from "react";

import EditorComponent, { Monaco, OnChange } from "@monaco-editor/react";
import { EditorProps } from "@monaco-editor/react";

function removeSubstring(str: string, start: number, end: number) {
    console.log(str, start, end);
    console.log(str.length);
    if (start == 0 && end == str.length) {
        return "";
    }
    if (start == 0) {
        console.log("in start");
        return str.substring(end);
    }
    if (end == str.length - 1) {
        return str.substring(0, start);
    }
    // Use the substring method to remove the portion of the string
    return str.substring(0, start) + str.substring(end);
}

interface token {
    content: string;
    begin: number;
    end: number;
}


const extractTokens = (expression : string , regex : RegExp) => {
    var tokens: token[] = [];
    console.log("extracting")

    var match
    while ((match = regex.exec(expression)) !== null) {
        tokens.push({
            content: match[0],
            begin: match.index,
            end: match.index + match[0].length,
        })
        console.log("matching")
      }
    return tokens
}

function tokenize(input: string) {
    // Remove any whitespace from the expression
    let expression = input.replace(/\s/g, "");

    // Define an array to store the tokens
    var tokens: token[] = [];

    // Define a regular expression to match operators and parentheses
    var bracketOpenRegex = /[(]|abs\|/;
    var bracketCloseRegex = /[)]|\|/;

    // Negate Regex
    var negateRegex = /[!]/;

    // Operator Regex
    var operatorRegex = /[*/%+-]|==|<=|AND|OR/;

    // Define a regular expression to match numbers
    var numberRegex = /\d+/;

    // Define a regular expression to match identifiers
    var identifierRegex = /\w+/;


    var totalRegex = new RegExp("(" + bracketOpenRegex + ")|(" + 
    + bracketCloseRegex + ")|(" +
     + negateRegex + ")|(" +
     + operatorRegex + ")|(" +
     + numberRegex + ")|(" + 
     + identifierRegex + ")" )

    // Loop through the expression and tokenize it
    let i = 1;

    //console.log(extractTokens(input, bracketOpenRegex))

    while (expression.length > 0) {
        var match;

        // Match negation regex
        if ((match = negateRegex.exec(expression)) !== null) {
            console.log("total", match[0])
            tokens.push({
                content: match[0],
                begin: match.index,
                end: match.index + match[0].length,
            });
            expression = removeSubstring(
                expression,
                match.index,
                match.index + match[0].length
            );
        }
        
        // Match parentheses
        else if ((match = bracketOpenRegex.exec(expression)) !== null) {
            tokens.push({
                content: match[0],
                begin: match.index,
                end: match.index + match[0].length,
            });
            expression = removeSubstring(
                expression,
                match.index,
                match.index + match[0].length
            );
        }

        // Match identifiers and boolean literals
        else if ((match = identifierRegex.exec(expression)) !== null) {
            tokens.push({
                content: match[0],
                begin: match.index,
                end: match.index + match[0].length,
            });
            expression = removeSubstring(
                expression,
                match.index,
                match.index + match[0].length
            );
        }
        // Match arithmatic operators
        else if ((match = operatorRegex.exec(expression)) !== null) {
            tokens.push({
                content: match[0],
                begin: match.index,
                end: match.index + match[0].length,
            });
            expression = removeSubstring(
                expression,
                match.index,
                match.index + match[0].length
            );
        }

        // Match numbers
        else if ((match = numberRegex.exec(expression)) !== null) {
            tokens.push({
                content: match[0],
                begin: match.index,
                end: match.index + match[0].length,
            });
            expression = expression.slice(match.index + match[0].length);
        } else if ((match = bracketCloseRegex.exec(expression)) !== null) {
            tokens.push({
                content: match[0],
                begin: match.index,
                end: match.index + match[0].length,
            });
            expression = removeSubstring(
                expression,
                match.index,
                match.index + match[0].length
            );
        }

        // If we can't match anything, throw an error
        else {
            throw new Error(`Invalid expression ${expression}`);
        }

        if (i == 1000) {
            throw new Error(`infinite recursion in tokenizer`);
        }
        i++;
    }

    return tokens;
}

const Editor = () => {
    const editorRef = useRef(null);

    function handleEditorDidMount(editor: EditorProps, monaco: Monaco) {
        // here is the editor instance
        // you can store it in `useRef` for further usage

        monaco.languages.register({ id: "shoshin_condition" });

        function createDependencyProposals(range) {
            // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
            // here you could do a server side lookup
            return [
                {
                    label: "SelfX",
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: "The x position of your own character",
                    insertText: "SelfX",
                    range: range,
                },
            ];
        }

        monaco.languages.registerCompletionItemProvider("shoshin_condition", {
            provideCompletionItems: function (model, position) {
                var word = model.getWordUntilPosition(position);
                var range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };
                return {
                    suggestions: createDependencyProposals(range),
                };
            },
        });

        monaco.languages.setMonarchTokensProvider("shoshin_condition", {
            variables: [
                `SelfX`,
                "SelfY",
                "SelfVelX",
                "SelfVelY",
                "SelfAccX",
                "SelfAccY",
                "SelfDir",
                "SelfInt",
                "SelfSta",
                "SelfBodyState",
                "SelfBodyCounter",
                "OpponentX",
                "OpponentY",
                "OpponentVelX",
                "OpponentVelY",
                "OpponentAccX",
                "OpponentAccY",
                "OpponentDir",
                "OpponentInt",
                "OpponentSta",
                "OpponentBodyState",
                "OpponentBodyCounter",
            ],

            operators: ["==", "<=", "*", "/", "%", "+", "-", "!", "AND", "OR"],
            tokenizer: {
                root: [
                    // identifiers and keywords
                    [
                        /[a-zA-Z_\$][\w$]*/,
                        { cases: { "@variables": "constant" } },
                    ],

                    // numbers
                    [/\d+/, "number"],
                ],
            },
        });

        editorRef.current = editor;
    }

    const handleChange: OnChange = (text, ev) => {
        //console.log(text);
        tokenize(text);

        // look for parens round

        // look for abs parens
        // look for operators
        // look for OpponentX
        // TODO : mapping moves to body state number
    };

    return (
        <EditorComponent
            height="500px"
            defaultLanguage="shoshin_condition"
            defaultValue="!(SelfX==1)AND(SelfX==2)"
            onMount={handleEditorDidMount}
            onChange={handleChange}
        />
    );
};

export default Editor;
