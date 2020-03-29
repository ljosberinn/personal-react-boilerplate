import { useRef, useEffect, useState } from 'react';

export default function useTimeout(timeout: number) {
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isTimedOut, setIsTimedOut] = useState(timeout <= 0);

  useEffect(() => {
    if (timeout > 0) {
      ref.current = setTimeout(() => {
        setIsTimedOut(true);
      }, timeout);

      return () => {
        ref.current && clearTimeout(ref.current);
      };
    }
  }, [timeout]);

  return isTimedOut;
}
