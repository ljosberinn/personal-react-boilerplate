import {
  render,
  userEvent,
  screen,
  testA11Y,
  validateHtml,
} from '../../../testUtils';
import { ColorModeSwitchAlt } from '../components/ColorModeSwitchAlt';

describe('<ColorModeSwitchAlt />', () => {
  it('passes a11y test', async () => {
    await testA11Y(<ColorModeSwitchAlt />);
  });

  it('contains valid html', () => {
    validateHtml(<ColorModeSwitchAlt />);
  });

  it('indicates the current theme visually', () => {
    render(<ColorModeSwitchAlt />);

    const input = screen.getByRole('checkbox');
    const sun = screen.getByTestId('theme-switch-sun');
    const moon = screen.getByTestId('theme-switch-moon');

    const sunClassListBefore = sun.classList.toString();
    const moonClassListBefore = moon.classList.toString();

    userEvent.click(input);

    expect(sun.classList.toString()).not.toBe(sunClassListBefore);
    expect(moon.classList.toString()).not.toBe(moonClassListBefore);
  });

  ['sun', 'moon'].forEach((icon) => {
    it(`allows changing the theme by clicking an icon alternatively - icon ${icon}`, () => {
      render(<ColorModeSwitchAlt />);

      const sun = screen.getByTestId('theme-switch-sun');
      const moon = screen.getByTestId('theme-switch-moon');

      const sunClassListBefore = sun.classList.toString();
      const moonClassListBefore = moon.classList.toString();

      userEvent.click(icon === 'sun' ? sun : moon);

      expect(sun.classList.toString()).not.toBe(sunClassListBefore);
      expect(moon.classList.toString()).not.toBe(moonClassListBefore);
    });
  });
});
