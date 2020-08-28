type ConsoleMethod = keyof typeof console;
type JestFn = ReturnType<typeof jest.fn>;

export type ConsoleMockWithDefault = {
  method: ConsoleMethod;
  mock?: JestFn;
};

/**
 * Overwrites passed console methods with your or silent implementations
 * Returns function to restore console.
 */
export const mockConsoleMethods = (
  args: ConsoleMockWithDefault['method'] | ConsoleMockWithDefault[]
): { restoreConsole: () => void } => {
  const mocks = Array.isArray(args) ? args : [{ method: args }];

  // eslint-disable-next-line no-console
  const source = mocks.map(({ method }) => console[method]);

  mocks.forEach(({ method, mock }) => {
    // eslint-disable-next-line no-console
    console[method] = mock ?? jest.fn().mockImplementation(() => {});
  });

  return {
    restoreConsole: () => {
      mocks.forEach(({ method }, index) => {
        // eslint-disable-next-line no-console
        console[method] = source[index];
      });
    },
  };
};
