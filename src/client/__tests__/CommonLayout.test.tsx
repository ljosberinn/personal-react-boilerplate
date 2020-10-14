import { testA11Y, validateHtml } from '../../../testUtils';
import { mockConsoleMethods } from '../../../testUtils/console';
import { CommonLayout } from '../layouts/CommonLayout';

describe('<CommonLayout />', () => {
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

  it('passes a11y test', async () => {
    await testA11Y(<CommonLayout>karma</CommonLayout>);
  });

  it('contains valid html', () => {
    validateHtml(<CommonLayout>karma</CommonLayout>, {
      htmlValidate: {
        rules: {
          'prefer-native-element': 'off',
        },
      },
    });
  });
});
