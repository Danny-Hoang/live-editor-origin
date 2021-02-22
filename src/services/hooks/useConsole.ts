import { useState, useCallback, useEffect } from 'react';
import { Hook, Console, Decode } from 'console-feed'
import { Message } from 'console-feed/lib/definitions/Console';

const useConsole = () => {
    const [logs, setLogs] = useState<Message[]>([]);
    useEffect(() => {
        
        Hook(
            window.console,
            log => {
                setLogs(s => [...s, log]);
            },
            false
          );
    }, [])

    return [logs, setLogs];
};

export default useConsole;
