import React from 'react';

import { theme } from '../../chakra';
import { render, screen } from '../../testUtils';
import { Chakra, ChakraProps } from './Chakra';

const defaultProps: ChakraProps = {
  // @ts-expect-error
  initialColorMode: theme.config.initialColorMode,
};

describe('<Chakra />', () => {
  it('should render without crashing', () => {
    render(<Chakra {...defaultProps}>test</Chakra>);
  });

  it('should accept child components', () => {
    render(
      <Chakra {...defaultProps}>
        <span>child</span>
      </Chakra>
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
