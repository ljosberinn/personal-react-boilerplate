import { render } from '@testing-library/react';
import React from 'react';

import SettingsAccount from './SettingsAccount';

describe('<SettingsAccount />', () => {
  it('should render without crashing', () => {
    render(<SettingsAccount />);
  });
});
