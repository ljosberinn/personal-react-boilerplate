import { useRef, useEffect, useState } from 'react';

/**
 *
 * @param {number} timeout
 */
export default function useTimeout(timeout) {
  const ref = useRef(null);
  const [isTimedOut, setIsTimedOut] = useState(timeout === 0);

  useEffect(() => {
    if (timeout > 0) {
      ref.current = setTimeout(() => {
        setIsTimedOut(true);
      }, timeout);

      return () => {
        clearTimeout(ref.current);
      };
    }
  }, [timeout]);

  return isTimedOut;
}
