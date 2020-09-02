import type { IndexPageProps } from '../../../pages';
import Index from '../../../pages';
import { render, act } from '../../../testUtils';

const defaultProps: Omit<IndexPageProps, 'children'> = {
  karma: {
    i18nBundle: {},
    language: 'en',
    session: null,
  },
};

describe('<Index />', () => {
  /**
   * when using chakra, components such as Popover or Menu will have effects -
   * to catch them, we need to do this stupid async dance here despite nothing
   * actually being a promise
   */
  it('renders without crashing', async () => {
    await act(async () => {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await render(<Index {...defaultProps}>hello world</Index>);
    });
  });
});
