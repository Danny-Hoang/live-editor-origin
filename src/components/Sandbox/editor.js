/* eslint-disable */
import * as React from "react";
import ReactDOM from "react-dom";
import ObjPath from "object-path";
import * as styled from 'styled-components';
import * as antd from 'antd';
import * as classnames from 'classnames';
import * as lodash from 'lodash';
import * as Acorn from "acorn";
import * as dateFns from 'date-fns';
import * as axios from 'axios';
import * as moment from 'moment';
import * as ReactSelect from 'react-select';
import * as faker from 'faker';
import { generate as generateJs } from "escodegen";
import { transform as babelTransform } from "@babel/standalone";

function isReactNode(node) {
    const type = node.type; //"ExpressionStatement"
    const obj = ObjPath.get(node, "expression.callee.object.name");
    const func = ObjPath.get(node, "expression.callee.property.name");
    return (
        type === "ExpressionStatement" &&
        obj === "React" &&
        func === "createElement"
    );
}

export function findReactNode(ast) {
    const { body } = ast;
    return body.find(isReactNode);
}

export function createEditor(domElement, moduleResolver = () => null) {
    function render(node) {
        ReactDOM.render(node, domElement);
    }

    let moduleMap = {}

    function require(moduleName) {
        const mapper = {
            'react': React,
            // 'styled-components': styled,
            'antd': antd,
            moment,
            classnames,
            lodash,
            'react-select': ReactSelect,
            'date-fns': dateFns,
            axios,
            // faker
        }

        if(moduleName === 'styled-components') {
            return styled
        }

        if(moduleMap[moduleName]) {
            return moduleMap[moduleName];
        }

        if (mapper[moduleName]) {
            return mapper[moduleName];
        }

        const code = moduleResolver(moduleName);
        const fn = getWrapperFunction(code);
        // console.log(fn.toString())
        return fn;
        // if(moduleName === 'react') {
        //     return React;
        // }
        // if(moduleName === 'styled-components') {
        //     return styled;
        // }
        // if(moduleName === 'antd') {
        //     return antd;
        // }

    }

    function getWrapperFunction(tcode) {
        try {
            // 1. transform code
            // if (!window['exports']) {
            //     window['exports'] = {}
            // }
            // const tcode = babelTransform(code, { presets: ["es2015", "react"], }).code;

            // 2. get AST
            const ast = Acorn.parse(tcode, {
                sourceType: "module"
            });

            // 3. find React.createElement expression in the body of program
            const rnode = findReactNode(ast);

            if (rnode) {
                const nodeIndex = ast.body.indexOf(rnode);
                // 4. convert the React.createElement invocation to source and remove the trailing semicolon
                const generated = generateJs(rnode);
                const createElSrc = generated.slice(0, -1);
                // 5. transform React.createElement(...) to render(React.createElement(...)),
                // where render is a callback passed from outside
                const renderCallAst = Acorn.parse(`render(${createElSrc})`).body[0];
                var array = ast.body;
                ast.body[nodeIndex] = renderCallAst;
                array.push(array.splice(nodeIndex, 1)[0]);
                // const renderCallAst = Acorn.parse(`render(${createElSrc})`)
                //     .body[0];

                // ast.body[nodeIndex] = renderCallAst;
            } else {
                const generated = generateJs(ast);
                const fn = new Function("React", "require", generated + `;return exports.default;`);
                const newFn = fn(React, require);
                return newFn;
            }

            // 6. create a new wrapper function with all dependency as parameters
            const generated = generateJs(ast);
            return new Function("React", "render", "require", generated);
        } catch (ex) {
            console.log(ex)
            // in case of exception render the exception message
            render(<pre style={{ color: "red" }}>{ex.message}</pre>);
        }
    }

    return {
        // returns transpiled code in a wrapper function which can be invoked later
        compile(tcode) {
            return getWrapperFunction(tcode);
        },

        // compiles and invokes the wrapper function
        async run(code) {
            try {
                // 1. transform code
                if (!window['exports']) {
                    window['exports'] = {}
                }
                const tcode = babelTransform(code, { presets: ["es2015", "react"], }).code;
                var matches = tcode.matchAll(/require\("([a-z-@\.\d]+)"\)/g);
                let result = [];
                for(let match of matches) {
                    let pkg = match[1];
                    if(pkg) {
                        result.push(pkg);
                    }
                }


                for(let pkg of result) {
                    let module = await window._import(pkg);
                    moduleMap[pkg] = module?.default;
                }

                const fn = this.compile(tcode);
                if (typeof fn === 'function') {
                    fn(React, render, require);
                }
            } catch (error) {
                console.log(error);
            }
        },

        // just compiles and returns the stringified wrapper function
        getCompiledCode(code) {
            return getWrapperFunction(code).toString();
        }
    };
}
