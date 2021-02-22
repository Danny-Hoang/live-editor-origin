/* eslint-disable jsx-a11y/anchor-is-valid */
import { Input } from 'antd';
import classNames from 'classnames';
import Snippet from "common/models/Snippet";
import Icon from "common/ui/Icon";
import faker from 'faker';
import React, { useCallback, useEffect, useRef, useState } from "react";
import KeyCode from 'services/constants/KeyCode';
import { setData, useData } from "services/data";
import useKeyDown from 'services/hooks/useKeyDown';
import { useSnippets } from "services/snippetService";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import styled from 'styled-components';
import MonacoEditor from './MonacoEditor';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import CodeEditor from '../CodeEditor';
import OverlayScrollbars from 'overlayscrollbars';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
const SandBox = () => {

    const snippets = useSnippets();
    const [snippet, setSnippet] = useState(new Snippet({ id: faker.random.uuid() }))
    const [showList, setShowList] = useState(true);
    const snippetRef = useRef(snippet);
    const activeID = useData('/activeID');
    const dataRef = useRef(snippets);
    const editorRef = useRef();
    // var m = function npm(p) {
    //     return import('https://cdn.skypack.dev/faker');
    // };

    // useEffect(async () => {
    //     var r = await npm();
    //     console.log(r)
    // }, [])

    useEffect(() => {
        let activeSnippet = snippets.find(s => s.id === activeID);
        if (activeSnippet) {

            setSnippet(activeSnippet);

            if (editorRef.current) {
                editorRef.current.setValue(activeSnippet.content)
            }
        }
    }, [activeID, snippets])

    // const [logs, setLogs] = useConsole();

    const [showEditor, setShowEditor] = useState(true);
    const [showConsole, setShowConsole] = useState(false);
    const [showEditTitle, setShowEditTile] = useState(false);

    // useEffect(() => {
    //     var objDiv = document.getElementById("console-wrap");
    //     if (objDiv) {
    //         objDiv.firstChild.scrollTop = objDiv.firstChild.scrollHeight;
    //     }
    // }, [logs.length, showConsole])


    const [autorun, setAutorun] = useState(false);
    useKeyDown(KeyCode.B, () => {
        setShowEditor(s => !s);
    });
    useKeyDown(KeyCode.Backquote, () => {
        setShowConsole(s => !s);
    });
    useKeyDown(KeyCode.R, () => {
        if (snippetRef.current.content) {
            // editorRef.current.run(snippetRef.current.content);
        }
    });
    useKeyDown(KeyCode.S, () => {
        if (snippetRef.current.content && !snippetRef.current.title) {
            onClickNew(snippetRef.current.content);
        }

        if (snippetRef.current.content) {
            snippetRef.current.save();
            // editorRef.current.run(snippetRef.current.content);
        }
    });

    const beforeMount = (monaco) => {
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
        });
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false,
        });
    }

    const editorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        editorRef.current.onDidChangeModelContent(ev => {
            const value = editorRef.current.getValue();
            const newSnippet = new Snippet({
                ...snippetRef.current,
                content: value
            });
            setSnippet(newSnippet)
            snippetRef.current = newSnippet;

        });
    }
    const onCodeChange = (newValue, e) => {
        const newSnippet = new Snippet({
            ...snippet,
            content: newValue
        });
        setSnippet(newSnippet)
        snippetRef.current = newSnippet;
    }
    // const onCodeChange = (value) => {
    //     const newSnippet = new Snippet({
    //         ...snippet,
    //         content: value
    //     });
    //     setSnippet(newSnippet)
    //     snippetRef.current = newSnippet;

    //     // editorRef.current.run(value);
    // };

    const onSave = useCallback(() => {
        if (snippet.id && snippet.title) {
            snippet.save();
        }
    }, [snippet]);

    const onBlur = () => {
        if (snippet.id && snippet.title) {
            snippet.save();
        }
    }

    const onBlurTitle = () => {
        setShowEditTile(false);
        if (snippet.id && snippet.title) {

            snippet.save();
        }
    }


    const onChangeSnippetTitle = (e) => {
        let value = e.target.value;
        const newSnippet = new Snippet({
            ...snippet,
            title: value
        });
        setSnippet(newSnippet)
        snippetRef.current = newSnippet;

    }

    useEffect(() => {
        setShowEditTile(false);
    }, [snippet.id])



    const remove = () => {
        snippet.remove();

        const newSnippet = new Snippet({
            id: faker.random.uuid()
        });
        setSnippet(newSnippet)
        snippetRef.current = newSnippet;
    }

    const onClickShowList = () => {
        setShowList(s => !s);
    };
    const onClickSnippet = (e) => {
        const newSnippet = new Snippet({
            ...e
        });
        snippetRef.current = newSnippet;
        setSnippet(newSnippet);
        if (e.id) {
            setData('/activeID', e.id)
        }
    };


    const onClickEditTitle = () => {
        setShowEditTile(true);
    }

    const onClickNew = (content) => {

        let newID = faker.random.uuid();
        const newSnippet = new Snippet({
            id: newID,
            title: 'untitled',
            content: content || '',
            fileName: ''
        })
        setSnippet(newSnippet);
        newSnippet.save();
        setData('/activeID', newID);
    }

    const toggleAutorun = () => {
        setAutorun(s => !s);
    }
    const toggleShowConsole = () => {
        setShowConsole(s => !s);
    }

    const clearConsole = () => {
        // setLogs([]);
    }

    const [isCenterMode, setIsCenterMode] = useState(true);
    const toggleCenter = () => {
        setIsCenterMode(s => !s);
    }

    // let filteredLog = logs;
    // try {

    //     filteredLog = logs.filter(l => l.data.find(s => s.indexOf('React.createElement') === -1 && s.indexOf('styled-components') === -1))
    // } catch (error) {
    // }

    return (
        <Wrap className="app flex items-stretch">
            <div className="split-view flex items-stretch">
                {
                    showList && (

                        <div className="left-menu">
                            <div className="row-flex my-2 mr-3">
                                <Icon type="plus" size={16} color="royalblue" onClick={() => onClickNew()} className=" ml-auto cursor-pointer" />
                            </div>
                            <ListSnippet>
                                {
                                    snippets.map(e => (
                                        <div className={classNames("snippet-item", { active: e.id === snippet.id })} onClick={() => onClickSnippet(e)} key={e.id}>{e.title}</div>
                                    ))
                                }
                            </ListSnippet>
                        </div>
                    )
                }

                <div className={classNames("code-editor", { 'inactive': !showEditor })}>
                    <SnippetTitle className="row-flex">
                        {
                            showEditTitle ? (
                                <StyledInput
                                    autoFocus
                                    value={snippet.title}
                                    onChange={onChangeSnippetTitle}
                                    onBlur={onBlurTitle}
                                    onPressEnter={onBlurTitle}
                                />
                            ) : (
                                    <div style={{ width: '250px' }} onClick={onClickEditTitle}>
                                        {snippet.title}
                                    </div>
                                )
                        }
                        {/* <div className="row-flex ml-auto">
                            <AutoIcon onClick={toggleAutorun} className={classNames("mr-3", { active: autorun })}>auto</AutoIcon>
                            <AutoIcon onClick={toggleShowConsole} className={classNames("mr-3", { active: showConsole })}>console</AutoIcon>
                            <Icon type="list" hoverColor="royalblue" onClick={onClickShowList} color="#4a5568" className="pointer" size={20} />
                            <Icon type="trash" hoverColor="royalblue" onClick={remove} color="#4a5568" className="pointer ml-3" size={20} />

                        </div> */}
                    </SnippetTitle>
                    {/* <CodeEditor code={snippet.content} onChange={onCodeChange} onBlur={onBlur} onSave={onSave} /> */}
                    <MonacoEditor
                        code={snippet.content}
                        onMount={editorDidMount}
                        beforeMount={beforeMount}

                    />
                </div>
            </div>
            <StyledIFrame src="http://localhost:8888/" title="tét"></StyledIFrame>

            {/* <LogWrap id="console-wrap" className={classNames({ inactive: !showConsole })}>
                <div className="console">
                </div>
                <div className="row-flex console-buttons">
                    <AutoIcon onClick={toggleShowConsole} className={classNames("mx-3 cursor-pointer", { active: showConsole })}>console</AutoIcon>
                    <AutoIcon onClick={clearConsole} className={classNames("mr-3 cursor-pointer", { active: showConsole })}>clear</AutoIcon>
                    <AutoIcon onClick={toggleCenter} className={classNames("mr-3 cursor-pointer center-button", { active: isCenterMode })}>center</AutoIcon>
                </div>
            </LogWrap> */}
        </Wrap>
    );
}

export default SandBox;


const Wrap = styled.div`
    * {
        box-sizing: border-box;
        -webkit-fontsmoothing: antialiased;
        font-family: "Monaco", "Consolas", "sans";
    }

    .split-view {
        display: flex;
    }

    .left-menu {
        background: #1b1c1f;
        color: #ccc;
        width: 250px;
        height: 100vh;
    }

    div.preview {
        flex: 1;
        &:last-child {
            border-top: solid 1px #ccc;
            border-right: solid 1px #ccc;
            border-bottom: solid 1px #ccc;
        }
        &:empty:before {
            content: "Nothing to render";
            color: rgba(0, 0, 0, 0.3);
        }

        &.center-mode {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .code-editor {
        flex: 1;
        width: 600px;
        overflow: hidden;
        .CodeMirror {
            height: calc(100vh - 40px);
        }

        &.inactive {
            flex: none;
            width: 0;
            height: 0;
            overflow: hidden;
        }
    }
`

const ListSnippet = styled(SimpleBar)`
    /* background: black; */
    height: calc(100% - 32px);
    .snippet-item {
        line-height: 24px;
        font-size: 14px;
        font-weight: 500;
        padding-left: 24px;
        color: var(--gray-8);
        cursor: pointer;
        font-family: Karla;
        &:hover {
            color: #2196F3;
        }
        &.active {
            color: #2196F3;
            pointer-events: none;
            cursor: default;
        }
    }
`

const SnippetTitle = styled.div`
    height: 50px;
    color: #c54444;
    cursor: pointer;
    padding-left: 20px;
    font-size: 14px;
    padding-bottom: 10px;
    background-color: #202124;
    font-family: Karla;
    
`

const StyledInput = styled(Input)`
    outline: none;
    border: none;
    border-radius: 3px;
    line-height: 26px;
    padding: 0 10px;
    background-color: #303c48;
    color: #c54444;
    width: 250px;
    box-shadow: none;
    &:focus {
        outline: none !important;
        border: none !important;
        box-shadow: none;
    }
`

const AutoIcon = styled.span`
    color: #4a5568;
    &.active {
        color: royalblue;
    }
`
const StyledIFrame = styled.iframe`
    flex: 1;
`