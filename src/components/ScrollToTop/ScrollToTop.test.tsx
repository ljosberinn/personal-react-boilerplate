import { createMemoryHistory } from 'history';
import React, { PropsWithChildren } from 'react';

import { render, fireEvent } from '../../testUtils';
import ScrollToTop from './ScrollToTop';

function Wrapper({ children }: PropsWithChildren<{}>) {
  return <div style={{ height: '2000px' }}>{children}</div>;
}

describe('<ScrollToTop />', () => {
  it('should render without crashing', () => {
    render(
      <Wrapper>
        <ScrollToTop />
      </Wrapper>
    );
  });

  it('should scroll to top after changing path', () => {
    window.scrollTo = jest.fn();

    const history = createMemoryHistory({
      initialEntries: ['/some-fake-route'],
    });

    render(
      <Wrapper>
        <ScrollToTop />
      </Wrapper>,
      { history }
    );

    fireEvent.scroll(window, { target: { scrollY: 500 } });

    expect(window.scrollY).toBe(500);

    history.push('/');

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
