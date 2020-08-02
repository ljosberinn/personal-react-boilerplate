import theme from '@chakra-ui/theme';
import React from 'react';

import { render, screen } from '../../testUtils';
import { Chakra, ChakraProps } from './Chakra';

const defaultProps: ChakraProps = {
  children: <>test</>,
  initialColorMode: theme.config.initialColorMode ?? 'dark',
};

describe('<Chakra />', () => {
  it('renders without crashing', () => {
    render(<Chakra {...defaultProps} />);
  });

  it('accepts children', () => {
    render(<Chakra {...defaultProps} />);

    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
