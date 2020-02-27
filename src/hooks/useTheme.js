import { useContext } from 'react';

import { ThemeContext } from '../context/ThemeContext';

/**
 * @returns {{
 * theme: 'light' | 'dark',
 * toggleTheme: () => void,
 * }}
 */
export default function useTheme() {
  return useContext(ThemeContext);
}
