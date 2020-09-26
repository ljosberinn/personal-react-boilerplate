import type { IndexPageProps } from '../../../pages';
import Index from '../../../pages';
import { render } from '../../../testUtils';

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
  it('renders without crashing', () => {
    render(<Index {...defaultProps}>hello world</Index>);
  });
});
