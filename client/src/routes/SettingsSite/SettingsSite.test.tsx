import React from 'react';

import { render } from '../../testUtils';
import SettingsSite from './SettingsSite';

describe('<SettingsSite />', () => {
  it('should render without crashing', () => {
    render(<SettingsSite />);
  });
});
