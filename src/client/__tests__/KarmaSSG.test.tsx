import { render } from '../../../testUtils';
import { i18nCache } from '../../../testUtils/i18n';
import * as i18n from '../i18n';
import type { KarmaSSGProps } from '../karma/SSG';
import { KarmaSSG } from '../karma/SSG';

const defaultProps: KarmaSSGProps = {
  auth: {
    session: null,
  },
  i18n: {
    bundle: i18nCache.de,
    language: 'en',
  },
};

const children = 'next-karma';

describe('<KarmaSSG />', () => {
  test('Core initializes i18next', () => {
    const initI18NSpy = jest.spyOn(i18n, 'initI18Next');

    render(<KarmaSSG {...defaultProps}>{children}</KarmaSSG>, {
      omitKarmaProvider: true,
    });

    expect(initI18NSpy).toHaveBeenCalledWith(
      expect.objectContaining(defaultProps.i18n)
    );
  });
});
