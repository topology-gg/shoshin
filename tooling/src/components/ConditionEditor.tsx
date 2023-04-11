import React, { useEffect, useRef, useState } from "react";

import EditorComponent, { useMonaco, Monaco, OnChange } from "@monaco-editor/react";
import { EditorProps } from "@monaco-editor/react";
import {
    ConditionElement,
    ConditionVerificationResult,
    ElementType,
    Operator,
    verifyValidCondition,
} from "../types/Condition";
import { Box } from "@mui/material";


interface token {
    content: string;
    begin: number;
    end: number;
    type : ElementType;
}


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


function tokenize(input: string): token[] {
    // Remove any whitespace from the expression
    let expression = input.replace(/\n/g, "");

    // Define an array to store the tokens
    var tokens: token[] = [];

    // Define a regular expression to match operators and parentheses
    var bracketOpenRegex = /^(\(|Abs\()(.*)/;
    var bracketCloseRegex = /^(\)|\|)(.*)/

    // Negate Regex
    var negateRegex = /^(!)(.*)/;

    // Operator Regex
    var operatorRegex = /^(\*|\/|%|\+|-|==|<=|AND|OR)(.*)/;

    // Define a regular expression to match numbers
    var numberRegex = /^(\d+)(.*)/;

    // Define a regular expression to match identifiers
    var identifierRegex = /^([a-zA-Z]+)(.*)/;

    // Loop through the expression and tokenize it
    let i = 1;

    while (expression && expression.length > 0) {
        var match;

        expression = expression.trim()

        // Match negation regex
        if ((match = negateRegex.exec(expression)) !== null) {
            tokens.push({
                content: match[1],
                begin: match.index,
                end: match.index + match[0].length,
                type : ElementType.Operator
            });
            expression = match[2]
        }

        // Match parentheses
        else if ((match = bracketOpenRegex.exec(expression)) !== null) {
            tokens.push({
                content: match[1],
                begin: match.index,
                end: match.index + match[0].length,
                type : ElementType.Operator
            });
            expression = match[2]
        }

        // Match arithmatic operators
        else if ((match = operatorRegex.exec(expression)) !== null) {
            tokens.push({
                content: match[1],
                begin: match.index,
                end: match.index + match[0].length,
                type : ElementType.Operator
            });
            expression = match[2]
        }

        // Match identifiers and boolean literals
        else if ((match = identifierRegex.exec(expression)) !== null) {
            tokens.push({
                content: match[1],
                begin: match.index,
                end: match.index + match[0].length,
                type : ElementType.BodyState
            });
            expression = match[2]
        }
        // Match numbers
        else if ((match = numberRegex.exec(expression)) !== null) {
            tokens.push({
                content: match[1],
                begin: match.index,
                end: match.index + match[0].length,
                type : ElementType.Constant
            });
            expression = match[2]
        } else if ((match = bracketCloseRegex.exec(expression)) !== null) {
            tokens.push({
                content: match[1],
                begin: match.index,
                end: match.index + match[0].length,
                type : ElementType.Operator
            });
            expression = match[2]
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


const conditionElementsToDisplayText = (elements : ConditionElement[]) => {

    console.log(elements)
   return elements.map(e => {
        if(e.value == Operator.OpenParenthesis || e.value == Operator.OpenAbs || Operator.Not){
            return e.value             
        } else  if (e.value == Operator.CloseParenthesis || e.value == Operator.CloseAbs)
        {
            return e.value
        } else {
            return e.value + " "
        }
    }).join("").trim()
}


interface ConditionEditorProps {
    initialConditionElements : ConditionElement[],
    setConditionElements : (is_valid : boolean, elements : ConditionElement[], warningText : string) => void
}
const ConditionEditor = ({initialConditionElements, setConditionElements} : ConditionEditorProps)   => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);

    const initialValue = initialConditionElements ? conditionElementsToDisplayText(initialConditionElements) : ""
    const [editorText, changeEditorText] = useState<string>(initialValue)

    useEffect(() => {
        changeEditorText(conditionElementsToDisplayText(initialConditionElements))
    }, [initialConditionElements])

   
    

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

    const handleChange: OnChange = (text, ev) => {

        changeEditorText(text)
        //tokenize
        let tokens;
        try{
            tokens = tokenize(text);
        }catch(e){
            setConditionElements(false, [], e.message)
            return
        }

        //transpile
        const elements: ConditionElement[] = tokens.map(t => ({
            value : t.content,
            type : t.type
        }))

        //verify
        const result: ConditionVerificationResult = verifyValidCondition(
            {
                elements,
            },
            true
        );

    
        if(!result.isValid)
        {
            //report errors to the editor screen and return
            setConditionElements(false, elements, result.message)
        }else
        {
            setConditionElements(true, elements,'')
        }


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
                defaultValue={editorText}
                value={editorText}
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

export default ConditionEditor