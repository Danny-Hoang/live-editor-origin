import React, { useEffect, useState } from 'react';
import Sandbox from 'components/Sandbox/Sandbox';
import ErrorBoundary from 'components/ErrorBoundary';
import styled from 'styled-components';
import { Hook, Console, Decode } from 'console-feed';

const Sandboxq = () => {
    console.log('rerender')
    return <div>test</div>
}
function App() {
    // const [logs, setLogs] = useState<any[]>([]);
    // useEffect(() => {
    //     document.addEventListener('keydown', (e) => {
            
    //     })
    //     Hook(
    //         window.console,
    //         log => {
    //             setLogs(s => [...s, log]);
    //         },
    //         false
    //       );
    // }, [])
    return (
        <div className="App">
            <ErrorBoundary>

                <Sandbox />
            </ErrorBoundary>
            {/* <LogWrap>
                <Console logs={logs} variant="dark" />
            </LogWrap> */}
        </div>
    );
}

export default App;

const LogWrap = styled.div`
    position: fixed;
    z-index: 9;
    width: 400px;
    height: 200px;
    right: 0;
    bottom: 0;
    overflow: auto;
`
