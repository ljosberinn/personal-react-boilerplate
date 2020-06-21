import React from 'react';

import { render } from '../../../../../testUtils';
import CustomPWAInstallPrompt from './CustomPWAInstallPrompt';

describe('<CustomPWAInstallPrompt />', () => {
  it('renders wihtout crashing', () => {
    render(<CustomPWAInstallPrompt />);
  });
});
