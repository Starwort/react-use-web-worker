import {useEffect, useRef, useState} from 'react';

interface UseWebWorker<In, Out> {
    lastMessage: Out | undefined;
    sendMessage: (message: In) => void;
}

export function useWebWorker<In = any, Out = any>(source: string, options?: WorkerOptions, defaultState?: Out): UseWebWorker<In, Out> {
    const worker = useRef<Worker>();
    const [lastMessage, setLastMessage] = useState(defaultState);
    useEffect(() => {
        let myWorker = worker.current = new Worker(source, options);
        worker.current.onmessage = (e) => setLastMessage(e.data);
        return () => myWorker.terminate();
    }, [source, options]);
    if (!worker.current) {
        return {lastMessage, sendMessage: (message) => {}};
    }
    return {lastMessage, sendMessage: worker.current.postMessage.bind(worker.current)};
}
