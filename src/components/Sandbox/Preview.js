import React, { useRef } from 'react';
import { useEffect, useState } from "react";
import { createEditor } from './editor';
const Preview = ({ code }) => {

    const run = (v) => {
        editorRef.current.run(v);
    }

    useEffect(() => {
        if(code) {
            run(code);
        }
    }, [code])

    const el = useRef();
    const editorRef = useRef();

    useEffect(() => {
        let edt = createEditor(el.current);
        editorRef.current = edt;
    }, [])
    
    
    return (
        <div className="preview" ref={el} />
    )
}

export default Preview;