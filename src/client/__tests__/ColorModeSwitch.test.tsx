/* eslint-disable testing-library/no-container */
import { FaSun, FaMoon } from 'react-icons/fa';

import {
  userEvent,
  render,
  testA11Y,
  validateHtml,
  screen,
} from '../../../testUtils';
import { ColorModeSwitch } from '../components/ColorModeSwitch';

describe('<ColorModeSwitchAlt />', () => {
  it('passes a11y test', async () => {
    await testA11Y(<ColorModeSwitch />);
  });

  it('contains valid html', () => {
    validateHtml(<ColorModeSwitch />, {
      htmlValidate: {
        rules: {
          'prefer-native-element': 'off',
        },
      },
    });
  });

  /**
   * Weird test, I know.
   *
   * - continues to work when initial theme is changed outside of the test
   * - continues to work given any prop on the `Box` component
   */
  it('indicates the current theme visually', () => {
    render(<ColorModeSwitch />);
    const { container: sunContainer } = render(<FaSun />);
    const { container: moonContainer } = render(<FaMoon />);

    const sunPath = sunContainer.querySelector('path')!.outerHTML;
    const moonPath = moonContainer.querySelector('path')!.outerHTML;

    const button = screen.getByRole('checkbox');

    const isInitiallyLight =
      button.querySelector('path')!.outerHTML === sunPath;

    userEvent.click(button);

    const postClickPath = button.querySelector('path')!.outerHTML;

    expect(postClickPath).not.toBe(isInitiallyLight ? sunPath : moonPath);
    expect(postClickPath).toStrictEqual(isInitiallyLight ? moonPath : sunPath);
  });
});
