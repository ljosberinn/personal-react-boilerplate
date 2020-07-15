import React from 'react';

import { theme } from '../../chakra';
import { render, screen } from '../../testUtils';
import { Chakra, ChakraProps } from './Chakra';

const defaultProps: ChakraProps = {
  children: <>test</>,
  initialColorMode: theme.config.initialColorMode,
};

describe('<Chakra />', () => {
  it('should render without crashing', () => {
    render(<Chakra {...defaultProps} />);
  });

  it('should accept child components', () => {
    render(<Chakra {...defaultProps} />);

    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
