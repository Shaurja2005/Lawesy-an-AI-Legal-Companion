import { useCallback, useRef, useState } from 'react';
import type { ParsedDocument } from '@/lib/parser';

type Status = 'idle' | 'parsing' | 'done' | 'error';

interface UseParserReturn {
  status: Status;
  result: ParsedDocument | null;
  error: string | null;
  parse: (text: string, filename?: string) => void;
  reset: () => void;
}

export function useParser(): UseParserReturn {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<ParsedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const parse = useCallback((text: string, filename?: string) => {
    // Terminate any previous worker
    workerRef.current?.terminate();

    setStatus('parsing');
    setResult(null);
    setError(null);

    const worker = new Worker(new URL('../workers/parser.worker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const { type, payload, message } = e.data;
      if (type === 'RESULT') {
        setResult(payload as ParsedDocument);
        setStatus('done');
      } else if (type === 'ERROR') {
        setError(message as string);
        setStatus('error');
      }
      worker.terminate();
    };

    worker.onerror = (e) => {
      setError(e.message);
      setStatus('error');
      worker.terminate();
    };

    worker.postMessage({ type: 'PARSE', payload: { text, filename } });
  }, []);

  const reset = useCallback(() => {
    workerRef.current?.terminate();
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, parse, reset };
}
