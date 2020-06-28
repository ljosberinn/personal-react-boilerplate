const typography = {
  fontSizes: {
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '4rem',
    lg: '1.125rem',
    md: '1rem',
    sm: '0.875rem',
    xl: '1.25rem',
    xs: '0.75rem',
  },
  fontWeights: {
    black: 900,
    bold: 700,
    extrabold: 800,
    hairline: 100,
    light: 300,
    medium: 500,
    normal: 400,
    semibold: 600,
    thin: 200,
  },
  fonts: {
    body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    mono: `SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace`,
  },
  letterSpacings: {
    normal: '0',
    tight: '-0.025em',
    tighter: '-0.05em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  lineHeights: {
    base: '1.5',
    none: '1',
    normal: 'normal',
    short: '1.375',
    shorter: '1.25',
    tall: '1.625',
    taller: '2',
  },
};

export type Typography = typeof typography;

export default typography;
