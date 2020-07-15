export const transition = {
  duration: {
    fast: '150ms',
    faster: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
    'ultra-fast': '50ms',
    'ultra-slow': '500ms',
  },
  property: {
    background: 'background-color, background-image, background-position',
    colors: 'background-color, border-color, color, fill, stroke',
    common:
      'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
    dimensions: 'width, height',
    position: 'left, right, top, bottom',
  },
  timingFunction: {
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
  },
};
