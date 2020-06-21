import React from 'react';

import { render, screen } from '../../testUtils';
import Chakra from './Chakra';

describe('<Chakra />', () => {
  it('should render without crashing', () => {
    render(<Chakra>test</Chakra>);
  });

  it('should accept child components', () => {
    const Child = () => <span>child</span>;

    render(
      <Chakra>
        <Child />
      </Chakra>
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
