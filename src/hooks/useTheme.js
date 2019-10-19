import { useState, useEffect } from 'react';

import { useDetectColorScheme } from '.';

const changeThemeOnHTMLTag = theme => {
  const thisTheme = `theme--${theme}`;
  const otherTheme = theme === 'light' ? 'theme--dark' : 'theme--light';

  const htmlTagClassList = document.getElementsByTagName('html')[0].classList;

  if (htmlTagClassList.contains(otherTheme)) {
    htmlTagClassList.replace(otherTheme, thisTheme);
    return;
  }

  htmlTagClassList.add(thisTheme);
};

export default function useTheme() {
  const theme = useDetectColorScheme() || 'light';
  const [usedTheme, setTheme] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const relevantTheme = usedTheme || theme;

  useEffect(() => {
    setIsLoading(true);

    changeThemeOnHTMLTag(relevantTheme);
    const href = 'https://unpkg.com/bulmaswatch/superhero/bulmaswatch.min.css';

    if (relevantTheme === 'dark') {
      document.querySelector('head').append(
        Object.assign(document.createElement('link'), {
          rel: 'stylesheet',
          href,
          onload: () => setIsLoading(false),
        }),
      );

      return;
    } else {
      setIsLoading(false);
    }

    const darkTheme = document.querySelector(`link[href="${href}"]`);

    if (darkTheme) {
      darkTheme.remove();
    }
  }, [relevantTheme]);

  return { theme: relevantTheme, isLoading, setTheme };
}
