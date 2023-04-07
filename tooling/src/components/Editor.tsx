import React, { useMemo, useState } from "react";


import EditorComponent from "@monaco-editor/react";
import dynamic from "next/dynamic";
const loader = dynamic(() => import("@monaco-editor/react").then(e => e.loader), {
    ssr: false,
});


const Editor = () => {
    
    console.log(loader)
    if(loader)
    {
        loader.init().then((monaco) => {
            const wrapper = document.getElementById("root");
            const properties = {
                value: 'function hello() {\n\talert("Hello world!");\n}',
                language: "javascript",
            };
            monaco.editor.create(wrapper, properties);
        });
    }
    
     
     
    return (
        <EditorComponent
            height="500px"
            defaultLanguage="javascript"
            defaultValue=""
        />
    );
};

export default Editor;
