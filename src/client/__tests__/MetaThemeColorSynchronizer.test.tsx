import { MetaThemeColorSynchronizer } from '../../../src/client/components/MetaThemeColorSynchronizer';
import { render } from '../../../testUtils';

/**
 * currently only a smoketest
 * next/head is currently not testable
 *
 * @see https://github.com/vercel/next.js/issues/15170
 */
describe('<MetaThemeColorSynchronizer />', () => {
  it('renders without crashing', () => {
    render(<MetaThemeColorSynchronizer />);
  });
});
