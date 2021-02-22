import React, { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
// import { copyToClipboard, getFileNameExtension } from 'common/util';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/addon/hint/show-hint.css';
require('codemirror/lib/codemirror.css');
require('codemirror/keymap/sublime.js');
require('codemirror/addon/comment/comment.js');
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/edit/closetag');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/edit/matchtags');
require('codemirror/addon/display/fullscreen');
require('codemirror/addon/hint/css-hint');
require('codemirror/addon/scroll/simplescrollbars');
require('codemirror/addon/scroll/simplescrollbars.css');
require('codemirror/addon/hint/show-hint');
require('codemirror/addon/hint/javascript-hint');
require('codemirror/keymap/emacs.js');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/addon/scroll/simplescrollbars');
require('codemirror/mode/sass/sass');
require('codemirror/mode/jsx/jsx');
require('codemirror/mode/markdown/markdown');
require('codemirror/mode/htmlmixed/htmlmixed');


const CodeEditor = (props) => {

    const [code, setCode] = useState(props.code || '');
    const { readOnly } = props;
    const [isEditMode, setIsEditMode] = useState(!readOnly);

    const [coppied, setCoppied] = useState(false);

    useEffect(() => {
        setIsEditMode(readOnly);
    }, [readOnly])

    const onMouseEnter = () => {
        setCoppied(false);
    }


    useEffect(() => {
        setCode(props.code);
    }, [props.code])

    // const onClickCopy = () => {
    //     copyToClipboard(code);
    //     setCoppied(true);
    // }


    const handlePaste = (e, data) => {
        console.log(e);
    }

    const handleBlur = () => {
        props.onBlur && props.onBlur();
    }


    // const getMode = useCallback((name) => {
    //     const ext = getFileNameExtension(name)
    //     const mapper = {
    //         'js': 'jsx',
    //         'jsx': 'jsx',
    //         'html': 'htmlmixed',
    //         'scss': 'sass',
    //         'css': 'sass',
    //         'md': 'markdown'

    //     }

    //     const mode = mapper[ext] || '';

    //     return mode;
    // }, []);

    const mode = 'jsx';

    return (

        <EditorContainer className="code-edit-container">
            <CodeMirror
                value={code}
                options={{
                    mode,
                    theme: 'material',
                    lineNumbers: true,
                    lineWrapping: false,
                    indentGuide: true,
                    keyMap: 'sublime',
                    matchBrackets: true,
                    matchTags: true,
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    scrollbarStyle: "simple",
                    extraKeys: {
                        "F11": function (cm) {
                            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                        },
                        "Esc": function (cm) {
                            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                        },
                        "Ctrl-S": function (instance) {
                            props.onSave && props.onSave();
                        },
                        "Ctrl-/": function (cm) {
                            cm.execCommand('toggleComment');
                        },
                        "Ctrl-Space": "autocomplete",
                        "Alt-Up": "swapLineUp",
                        "Alt-Down": "swapLineDown",
                        "Ctrl-X": "deleteLine",
                        "Shift-Alt-Up": "duplicateLine",
                        "Shift-Alt-Down": "duplicateLine",

                    }
                }}
                onBeforeChange={(editor, data, value) => {
                    setCode(value);
                }}
                onBlur={handleBlur}
                onPaste={handlePaste}
                onChange={(editor, data, value) => {
                    props.onChange && props.onChange(value);
                }}
            />
        </EditorContainer>
    )
}

export default CodeEditor;

const Wrap = styled.div`
    border: 1px solid var(--color-bg-primary);
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
    overflow: auto;
    /* width: fit-content;
    min-width: 100%; */
`
const Header = styled.div`
    border-bottom: 1px solid var(--color-bg-primary);
    background: var(--gray-200);
    height: 42px;
    display: flex;
    align-items: center;
    border-radius: 4px 4px 0 0;

    a {
        font-size: 12px;
        text-decoration: none;
        color: var(--text-link);
        font-weight: 500;
        margin-right: 20px;
    }
`

const FileName = styled.div`
    
`

const Textarea = styled.textarea`
    caret-color: black;
    z-index: 9;
    color: transparent;
    top: 0px;
    left: 27px;
    color: transparent;
    outline: none;
`

const EditorContainer = styled.div`
    position: relative;
    /* height: fit-content; */
    /* min-width: 100%; */
    /* min-width: calc(100% - 28px); */
    /* max-width: 750px; */
    /* overflow: auto; */
    background-color: hsl(212,35%,95%);
    /* margin: 1em; */
    font-size: 13px;

    .react-codemirror2 {
        /* width: fit-content; */
        /* min-width: 100%; */
    }
    .CodeMirror {
        height: fit-content;
        font-size: 14px;
        line-height: 1.5em;
    }
    .CodeMirror-hscrollbar {
        display: none !important;
    }
`
