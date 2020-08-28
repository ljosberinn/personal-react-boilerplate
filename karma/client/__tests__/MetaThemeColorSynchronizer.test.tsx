import { render } from '../../../testUtils';
import { MetaThemeColorSynchronizer } from '../components/MetaThemeColorSynchronizer';

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
