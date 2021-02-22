import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import styled from 'styled-components';

const MonacoEditor = ({ code, onMount, beforeMount }) => {
    const [value, setValue] = useState(code);
    useEffect(() => {
        setValue(code);
    }, [code])
   
    return (
        <StyledEditor
            height="calc(100vh - 50px)"
            defaultLanguage="typescript"
            theme="vs-dark"
            defaultValue={value}
            path="tet.ts"
            onMount={onMount}
            beforeMount={beforeMount}
            options={{
                lineNumbers: "on",
                minimap: {
                    enabled: false
                },
                fontSize: 14,
            }}
        />
    )
}

export default React.memo(MonacoEditor);

const StyledEditor = styled(Editor)`
    .monaco-editor {
        .scroll-decoration {
            display: none;
        }
    }
`