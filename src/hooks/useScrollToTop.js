import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 *
 * @param {ScrollOptions['behavior']} behavior
 */
export default function useScrollToTop(behavior = 'smooth') {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior });
  }, [pathname, behavior]);
}
