import React from 'react';

import { render } from '../../testUtils';
import Chakra from './Chakra';

describe('<Chakra />', () => {
  it('should render without crashing', () => {
    render(<Chakra>test</Chakra>);
  });

  it('should accept child components', () => {
    const Child = () => <span>child</span>;

    const { getByText } = render(
      <Chakra>
        <Child />
      </Chakra>
    );

    expect(getByText('child')).toBeInTheDocument();
  });
});
