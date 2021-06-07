import { render } from '../../../testUtils';
import { i18nCache } from '../../../testUtils/i18n';
import { FALLBACK_LANGUAGE } from '../../constants';
import * as Core from '../karma/Core';
import { KarmaSSG } from '../karma/SSG';
import type { KarmaSSGProps } from '../karma/SSG';

describe('<KarmaSSG />', () => {
  const defaultI18n: KarmaSSGProps['i18n'] = {
    locale: FALLBACK_LANGUAGE,
    resources: i18nCache,
  };

  test('forwards "mode="ssg" prop onto KarmaCore', () => {
    const children = 'next-karma';

    const mockProps: KarmaSSGProps = {
      auth: { session: null },
      i18n: defaultI18n,
    };

    const coreSpy = jest.spyOn(Core, 'KarmaCore');

    render(<KarmaSSG {...mockProps}>{children}</KarmaSSG>, {
      omitKarmaProvider: true,
    });

    expect(coreSpy).toHaveBeenCalledTimes(1);
    expect(coreSpy).toHaveBeenCalledWith(
      {
        ...mockProps,
        children,
        mode: 'ssg',
      },
      {}
    );
  });
});
