import React from 'react';
import { FaGithub } from 'react-icons/fa';

import { render } from '../../testUtils';
import CustomIcon from './CustomIcon';

describe('<CustomIcon />', () => {
  it('should render without crashing', () => {
    render(<CustomIcon icon={FaGithub} />);
  });
});
