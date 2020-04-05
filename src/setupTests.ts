// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import MutationObserver from '@sheerun/mutationobserver-shim';

beforeEach(() => {
  Object.defineProperty(window, 'scrollTo', {
    value: () => {},
    writable: true,
  });

  const resizeEvent = document.createEvent('Event');
  resizeEvent.initEvent('resize', true, true);

  Object.defineProperty(window, 'resizeTo', {
    writable: true,
    configurable: true,
    value: (width: number, height: number) => {
      // @ts-expect-error
      window.innerWidth = width || window.innerWidth;
      window.innerHeight = height || window.innerHeight;
      window.dispatchEvent(resizeEvent);
    },
  });

  window.MutationObserver = MutationObserver;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  class IntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserver,
  });

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserver,
  });
});
