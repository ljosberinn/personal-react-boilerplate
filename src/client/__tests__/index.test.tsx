import Index from '../../../pages/[locale]';
import type { IndexPageProps } from '../../../pages/[locale]';
import { render } from '../../../testUtils';
import { mockConsoleMethods } from '../../../testUtils/console';

const defaultProps: IndexPageProps = {
  karma: {
    auth: {
      session: null,
    },
    i18n: {
      bundle: {},
      language: 'en',
    },
  },
};

describe('<Index />', () => {
  let restoreConsole: ReturnType<typeof mockConsoleMethods>['restoreConsole'];

  beforeAll(() => {
    // eslint-disable-next-line prefer-destructuring
    restoreConsole = mockConsoleMethods([
      { method: 'warn' },
      { method: 'error' },
    ]).restoreConsole;
  });

  afterAll(() => {
    restoreConsole();
  });

  it('renders without crashing', () => {
    render(<Index {...defaultProps}>hello world</Index>);
  });
});
