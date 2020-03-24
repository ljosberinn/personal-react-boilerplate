import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
  behavior?: ScrollBehavior;
}

export default function ScrollToTop({ behavior = 'smooth' }: Props) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior });
  }, [behavior, pathname]);

  return null;
}
