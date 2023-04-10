import React, { useRef } from "react";

import EditorComponent, { useMonaco, Monaco, MonacoDiffEditor, OnChange } from "@monaco-editor/react";
import { EditorProps } from "@monaco-editor/react";
import {
    BodystatesAntoc,
    BodystatesJessica,
    ConditionElement,
    ConditionVerificationResult,
    ElementType,
    verifyValidCondition,
} from "../types/Condition";
import { Box } from "@mui/material";

function removeSubstring(str: string, start: number, end: number) {
    if (start == 0 && end == str.length) {
        return "";
    }
    if (start == 0) {
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

const extractTokens = (expression: string, regex: RegExp) => {
    var tokens: token[] = [];

    var match;
    while ((match = regex.exec(expression)) !== null) {
        tokens.push({
            content: match[0],
            begin: match.index,
            end: match.index + match[0].length,
        });
    }
    return tokens;
};

const perceptibles = [
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
];

const operators = ["==", "<=", "*", "/", "%", "+", "-", "!", "AND", "OR"];

function tokenizeInner(expression : string) : string[]{
    expression = expression.trim()
    
    console.log(expression)
    // Define an array to store the tokens
    var tokens: string[] = [];

    var match : RegExpExecArray;

    var notWParens = /^!\((.*)\)/

    if ((match = notWParens.exec(expression)) !== null) {
        tokens.push('!');
        tokens.push('(');
        console.log(match[1])
        tokenizeInner(match[1])
        tokens.push(')');
    }

    var bracketRegex = /\((.*)\)/

    if ((match = bracketRegex.exec(expression)) !== null) {
        tokens.push('(');
        tokens = tokens.concat(tokenizeInner(match[1]))
        tokens.push(')');
    }
    
    var notWIdentifier = /^!\w+\s+(.*)/

    if ((match = notWIdentifier.exec(expression)) !== null) {
        tokens.push('!');
        tokens.push(match[1]);
        tokens = tokens.concat(tokenizeInner(match[2]))
    }

    var operator = /^(==|<=|[*]|[\/]|[%]|[+]|[-]|AND|OR){1}\s+(.*)/

    if ((match = operator.exec(expression)) !== null) {
        tokens.push(match[1]);
        tokens = tokens.concat(tokenizeInner(match[2]))
    }

    var constant = /^(\d+)\s+(.*)/

    if ((match = constant.exec(expression)) !== null) {
        tokens.push(match[1]);
        tokens = tokens.concat(tokenizeInner(match[2]))
    }
    
    var identifier = /^(\w+){1}\s+(.*)/

    if ((match = identifier.exec(expression)) !== null) {
        tokens.push(match[1]);
        tokens = tokens.concat(tokenizeInner(match[2]))
    }

    var lastIdentifierOrConst = /^(\w+)$|^(\d+)$/

    if ((match = lastIdentifierOrConst.exec(expression)) !== null) {
        tokens.push(match[0]);
    }

    
    return tokens;
}
function tokenize(input: string): string[] {
    // Remove any whitespace from the expression
    let expression = input.replace(/\n/g, "");

    return tokenizeInner(expression)
    // Define an array to store the tokens
    var tokens: token[] = [];


    var notRegex = /!(\w+)(.*)/
    var notWParens = /!\((.*)\)/


    var bracketRegex = /\((.*)\)/
    var identifier = /\w+(.*)/


    console.log(operators.map(e => `[${e}]|`).join(''))
    var operator = /(==|<=|[*]|[/]|[%]|[+]|[-]|[!]|AND|OR)\w+(.*)/



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

    // Loop through the expression and tokenize it
    let i = 1;

    while (expression.length > 0) {
        var match;

        // Match negation regex
        if ((match = negateRegex.exec(expression)) !== null) {
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

const ConditionEditor = () => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);

    function handleEditorDidMount(editor: EditorProps, monaco: Monaco) {
        // here is the editor instance
        // you can store it in `useRef` for further usage

        monaco.languages.register({ id: "shoshin_condition" });

        function createDependencyProposals(range) {
            // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
            // here you could do a server side lookup
            return perceptibles.map(p => {
                return {
                    label: p,
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: "TBD",
                    insertText: p,
                    range: range,
                };
            })
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

        // Reference for usage: https://microsoft.github.io/monaco-editor/monarch.html
        monaco.languages.setMonarchTokensProvider("shoshin_condition", {
            variables: perceptibles,

            // define keywords here for our custom language
            keywords: [
                '==', 'AND', 'OR'
            ],

            tokenizer: {
                root: [
                    // identifiers and keywords
                    [
                        /[a-zA-Z_\$][\w$]*/,
                        { cases: {
                            "@variables": "constant",
                            "@keywords": "keyword",
                        } },
                    ],

                    // numbers
                    [/\d+/, "number"],

                    // delimiters and operators
                    // [/@symbols/, { cases: {
                    //     '@operators': 'operator',
                    //     '@default'  : '' } } ],
                ],
            },
        });

        editorRef.current = editor;
        monacoRef.current = monaco
    }

    const tokensToElements = (token : string) => {
        if (operators.includes(token)) {
            return {
                value: token,
                type: ElementType.Operator,
            } as ConditionElement;
        }
        if (perceptibles.includes(token)) {
            return {
                value: token,
                type: ElementType.Perceptible,
            } as ConditionElement;
        }

        if (Object.keys(BodystatesJessica).includes(token)) {
            return {
                value: BodystatesJessica[token],
                type: ElementType.BodyState,
            } as ConditionElement;
        }

        if (Object.keys(BodystatesAntoc).includes(token)) {
            return {
                value: BodystatesAntoc[token],
                type: ElementType.BodyState,
            } as ConditionElement;
        }
        return {
            value: token,
            type: ElementType.Constant,
        } as ConditionElement;
    };

    const handleChange: OnChange = (text, ev) => {
        //tokenize
        const tokens = tokenize(text);
        console.log('tokenize():', tokens)

        //transpile
        const elements: ConditionElement[] = tokens.map(tokensToElements);
        console.log('tokens.map(tokensToElements):', elements)

        //verify
        const result: ConditionVerificationResult = verifyValidCondition(
            {
                elements,
            },
            false
        );

        if(!result.isValid)
        {
            console.log('condition verification failed.');
            //report errors to the editor screen and return
            (monacoRef.current as Monaco).editor
        }

        //save condition changes?
    };

    const monaco = useMonaco();
    monaco?.editor.defineTheme('editor-theme', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#ffffffff',
            'editor.lineHighlightBackground': '#00000000',
            'editor.lineHighlightBorder': '#00000000',
            'scrollbar.shadow': '#00000000',
        },
    });

    return (
        <Box style={{border:'1px solid #BBB', marginLeft:'8px'}}>
            <EditorComponent
                height="200px"
                width="400px"
                defaultLanguage="shoshin_condition"
                defaultValue="!(SelfX == 1) AND (SelfX == 2)"
                theme='editor-theme'
                options={{
                    minimap: {
                      enabled: false,
                    },
                    wordWrap: "on",
                    fontSize: 16,
                    lineNumbers: 'off',
                }}

                //@ts-ignore
                onMount={handleEditorDidMount}
                onChange={handleChange}
            />
        </Box>
    );
};

// sorting tokens in order
// putting error back into the editor
// complete autofill options
// put into condition panel
// have agent build only after succesfull confirm (not every update)
// customize editor - remove scroll and the sidebar, rm line numbers

export default ConditionEditor;
