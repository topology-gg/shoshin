import React, { useMemo, useRef, useState } from "react";

import EditorComponent, { Monaco } from "@monaco-editor/react";
import dynamic from "next/dynamic";

const Editor = () => {
    const editorRef = useRef(null);

    function handleEditorDidMount(editor: any, monaco: Monaco) {
        // here is the editor instance
        // you can store it in `useRef` for further usage

        monaco.languages.register({ id: "shoshin_condition" });

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
            
              operators: [
                '==', '<=', '*', '/', '%', '+', '-', '!', 
              ],
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

    return (
        <EditorComponent
            height="500px"
            defaultLanguage="shoshin_condition"
            defaultValue=""
            onMount={handleEditorDidMount}
        />
    );
};

export default Editor;

/**
 * 
 * 
 * 
import React, { useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";

const App = () => {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    console.log("hhh", editor, monaco);
    editorRef.current = editor;
  }

  return (
    <div>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default App;


 */
