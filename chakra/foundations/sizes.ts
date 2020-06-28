export const baseSizes = {
  '0': '0',
  '1': '0.25rem',
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '2': '0.5rem',
  '20': '5rem',
  '24': '6rem',
  '3': '0.75rem',
  '32': '8rem',
  '4': '1rem',
  '40': '10rem',
  '48': '12rem',
  '5': '1.25rem',
  '56': '14rem',
  '6': '1.5rem',
  '64': '16rem',
  '8': '2rem',
  px: '1px',
};

export type BaseSizes = typeof baseSizes;

const largeSizes = {
  '2xl': '42rem',
  '2xs': '16rem',
  '3xl': '48rem',
  '3xs': '14rem',
  '4xl': '56rem',
  '5xl': '64rem',
  '6xl': '72rem',
  full: '100%',
  lg: '32rem',
  md: '28rem',
  sm: '24rem',
  xl: '36rem',
  xs: '20rem',
};

const container = {
  lg: '1024px',
  md: '768px',
  sm: '640px',
  xl: '1280px',
};

const sizes = {
  ...baseSizes,
  ...largeSizes,
  container,
};

export type Sizes = typeof baseSizes &
  typeof largeSizes & { container: typeof container };

export default sizes;
