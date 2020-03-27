import { render } from '@testing-library/react';
import React from 'react';

import SettingsSite from './SettingsSite';

describe('<SettingsSite />', () => {
  it('should render without crashing', () => {
    render(<SettingsSite />);
  });
});
