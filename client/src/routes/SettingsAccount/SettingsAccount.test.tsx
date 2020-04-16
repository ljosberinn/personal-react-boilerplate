import * as React from 'react';

import { render } from '../../testUtils';
import SettingsAccount from './SettingsAccount';

describe('<SettingsAccount />', () => {
  it('should render without crashing', () => {
    render(<SettingsAccount />);
  });
});
