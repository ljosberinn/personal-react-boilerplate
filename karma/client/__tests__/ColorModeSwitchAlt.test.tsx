import { FaSun, FaMoon } from 'react-icons/fa';

import {
  userEvent,
  render,
  testA11Y,
  validateHtml,
  screen,
} from '../../../testUtils';
import { ColorModeSwitchAlt } from '../components/ColorModeSwitchAlt';

describe('<ColorModeSwitchAlt />', () => {
  it('passes a11y test', async () => {
    await testA11Y(<ColorModeSwitchAlt />);
  });

  it('contains valid html', () => {
    validateHtml(<ColorModeSwitchAlt />, {
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
    render(<ColorModeSwitchAlt />);
    const sun = render(<FaSun />);
    const moon = render(<FaMoon />);

    const sunPath = sun.container.querySelector('path')!.outerHTML;
    const moonPath = moon.container.querySelector('path')!.outerHTML;

    const button = screen.getByRole('checkbox');

    const isInitiallyLight =
      button.querySelector('path')!.outerHTML === sunPath;

    userEvent.click(button);

    const postClickPath = button.querySelector('path')!.outerHTML;

    expect(postClickPath).not.toBe(isInitiallyLight ? sunPath : moonPath);
    expect(postClickPath).toStrictEqual(isInitiallyLight ? moonPath : sunPath);
  });
});
