import React, { useRef } from "react";

import EditorComponent, { Monaco, OnChange } from "@monaco-editor/react";
import { EditorProps } from "@monaco-editor/react";
import {
    BodystatesAntoc,
    BodystatesJessica,
    ConditionElement,
    ConditionVerificationResult,
    ElementType,
    verifyValidCondition,
} from "../types/Condition";

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

const Editor = () => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);

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
            variables: perceptibles,

            operators,
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
        monacoRef.current = monaco
    }

    const tokensToElements = (token) => {
        if (operators.includes(token.content)) {
            return {
                value: token.content,
                type: ElementType.Operator,
            } as ConditionElement;
        }
        if (perceptibles.includes(token.content)) {
            return {
                value: token.content,
                type: ElementType.Perceptible,
            } as ConditionElement;
        }

        if (Object.keys(BodystatesJessica).includes(token.content)) {
            return {
                value: BodystatesJessica[token.content],
                type: ElementType.BodyState,
            } as ConditionElement;
        }

        if (Object.keys(BodystatesAntoc).includes(token.content)) {
            return {
                value: BodystatesAntoc[token.content],
                type: ElementType.BodyState,
            } as ConditionElement;
        }
        return {
            value: token.content,
            type: ElementType.Constant,
        } as ConditionElement;
    };

    const handleChange: OnChange = (text, ev) => {
        //tokenize
        const tokens = tokenize(text);
        //transpile
        const elements: ConditionElement[] = tokens.map(tokensToElements);
        //verify
        const result: ConditionVerificationResult = verifyValidCondition(
            {
                elements,
            },
            false
        );

        
        if(!result.isValid)
        {
            //report errors to the editor screen and return
            (monacoRef.current as Monaco).editor    
        }

        //save condition changes?
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

// sorting tokens in order
// putting error back into the editor
// complete autofill options
// put into condition panel
// have agent build only after succesfull confirm (not every update)
// customize editor - remove scroll and the sidebar, rm line numbers

export default Editor;
