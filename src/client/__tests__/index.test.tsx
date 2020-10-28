import { render } from '../../../testUtils';
import { mockConsoleMethods } from '../../../testUtils/console';
import Index from '../../pages';

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
    render(<Index />);
  });
});
