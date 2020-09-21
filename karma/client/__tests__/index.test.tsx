import type { IndexPageProps } from '../../../pages';
import Index from '../../../pages';
import { render } from '../../../testUtils';
import { createUseRouterMock } from '../../../testUtils/router';

const defaultProps: IndexPageProps = {
  karma: {
    i18nBundle: {},
    language: 'en',
  },
};

describe('<Index />', () => {
  it('renders without crashing', () => {
    createUseRouterMock({ once: false });

    render(<Index {...defaultProps}>hello world</Index>);
  });
});
