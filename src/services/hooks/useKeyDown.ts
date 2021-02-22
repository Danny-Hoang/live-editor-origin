import { useState, useCallback, useEffect } from 'react';

const useKeyDown = (keyCode: number, onKeyPressed?: any) => {
    const [keyPressed, setKeyPressed] = useState(false);

    const onKeyDown = useCallback(e => {
        if (e.keyCode === keyCode && e.ctrlKey) {
            e.preventDefault();
            setKeyPressed(true);
            onKeyPressed && onKeyPressed();
        }
    }, []);
    const onKeyUp = useCallback(e => {
        setKeyPressed(false);
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);
        return () => {
            document.removeEventListener('keydown', onKeyUp);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    return keyPressed;
};

export default useKeyDown;
