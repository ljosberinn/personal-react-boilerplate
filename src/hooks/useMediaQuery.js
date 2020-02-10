import { useState, useEffect } from 'react';

// https://youtu.be/dpw9EHDh2bM?t=3765
/**
 *
 * @param {string} query
 */
export default function useMediaQuery(query) {
  const [isMatchingQuery, setMatchingQuery] = useState(
    window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = () => {
      const { matches } = media;

      if (matches !== isMatchingQuery) {
        setMatchingQuery(matches);
      }
    };

    media.addListener(listener);

    return () => media.removeListener(listener);
  }, [query, isMatchingQuery]);

  return isMatchingQuery;
}
