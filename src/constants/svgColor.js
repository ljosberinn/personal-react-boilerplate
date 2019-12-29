const colors = {
  dark: {
    primary: '#df691a',
  },
  light: {
    primary: '#00d1b2',
  },
};

const general = {
  purple: '#3f3d56',
};

/**
 *
 * @param {'light' | 'dark'} theme
 * @returns {{
 * primary: string,
 * purple: string
 * }}
 */
const getThemeBasedSvgColor = theme => ({ ...general, ...colors[theme] });

export default getThemeBasedSvgColor;
