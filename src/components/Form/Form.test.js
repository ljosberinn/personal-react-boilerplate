import { fireEvent } from '@testing-library/react';
import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import Form from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const defaultProps = {
  onSubmit: jest.fn(),
};

describe('<Form />', () => {
  it('renders without crashing', () => {
    render(
      <Form {...defaultProps}>
        <h1>hello form</h1>
      </Form>,
    );
  });

  it('should render a HTMLFormElement', () => {
    const { container } = render(
      <Form {...defaultProps}>
        <h1>hello form</h1>
      </Form>,
    );

    expect(container.querySelector('form')).not.toBe(null);
  });

  it('always renders children', () => {
    const { container } = render(
      <Form {...defaultProps}>
        <h1>hello form</h1>
      </Form>,
    );

    expect(container.querySelectorAll('h1').length).toBe(1);
    expect(container.querySelector('h1').textContent).toBe('hello form');
  });

  ['spellCheck', 'autoCorrect'].forEach(property => {
    it(`attaches a default value for '${property}'`, () => {
      const { container } = render(
        <Form {...defaultProps}>
          <h1>hello form</h1>
        </Form>,
      );

      expect(container.querySelector('form')[property]).not.toBe(null);
    });
  });

  it(`allows overriding the default value of 'spellCheck'`, () => {
    const { container } = render(
      <Form {...defaultProps} spellCheck={true}>
        <h1>hello form</h1>
      </Form>,
    );

    expect(
      container.querySelector('form').outerHTML.includes('spellcheck="true"'),
    ).toBe(true);
  });

  it(`allows overriding the default value of 'autoCorrect'`, () => {
    const { container } = render(
      <Form {...defaultProps} autoCorrect="on">
        <h1>hello form</h1>
      </Form>,
    );

    expect(
      container.querySelector('form').outerHTML.includes('autocorrect="on"'),
    ).toBe(true);
  });

  it('executes the given onSubmit function on submit', () => {
    const handleSubmit = jest.fn();

    const { container } = render(
      <Form {...defaultProps} onSubmit={handleSubmit}>
        <button type="submit">button</button>
      </Form>,
    );

    fireEvent.submit(container.querySelector('form'));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
