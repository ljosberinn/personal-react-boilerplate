import { render, screen } from '../../../testUtils';
import { i18nCache } from '../../../testUtils/i18n';
import { FALLBACK_LANGUAGE } from '../../constants';
import { IsomorphicKarma } from '../karma/Isomorphic';
import * as SSG from '../karma/SSG';
import type { KarmaSSGProps } from '../karma/SSG';
import * as SSR from '../karma/SSR';
import type { KarmaSSRProps } from '../karma/SSR';

const children = 'next-karma';
const mockChildren = 'karma-ssg';

const ssgProps: KarmaSSGProps = {
  auth: {
    redirectDestinationIfUnauthenticated: '',
    session: null,
    shouldAttemptReauthentication: false,
  },
  i18n: {
    locale: FALLBACK_LANGUAGE,
    resources: i18nCache,
  },
};

const ssrProps: KarmaSSRProps = {
  ...ssgProps,
  cookies: '',
};

describe('<IsomorphicKarma />', () => {
  it('renders KarmaSSG given appropriate props', () => {
    const ssgSpy = jest
      .spyOn(SSG, 'KarmaSSG')
      .mockImplementationOnce(() => <h1>{mockChildren}</h1>);
    const ssrSpy = jest.spyOn(SSR, 'KarmaSSR');

    render(<IsomorphicKarma karma={ssgProps}>{children}</IsomorphicKarma>);

    expect(screen.getByText(mockChildren)).toBeInTheDocument();

    expect(ssgSpy).toHaveBeenCalledTimes(1);
    expect(ssrSpy).not.toHaveBeenCalled();
  });

  it('renders KarmaSSR given appropriate props', () => {
    const ssgSpy = jest.spyOn(SSG, 'KarmaSSG');
    const ssrSpy = jest
      .spyOn(SSR, 'KarmaSSR')
      .mockImplementationOnce(() => <h1>{mockChildren}</h1>);

    render(<IsomorphicKarma karma={ssrProps}>{children}</IsomorphicKarma>);

    expect(screen.getByText(mockChildren)).toBeInTheDocument();

    expect(ssrSpy).toHaveBeenCalledTimes(1);
    expect(ssgSpy).not.toHaveBeenCalled();
  });

  it('renders children given no karma props', () => {
    const ssgSpy = jest.spyOn(SSG, 'KarmaSSG');
    const ssrSpy = jest.spyOn(SSR, 'KarmaSSR');

    render(<IsomorphicKarma>{children}</IsomorphicKarma>);

    expect(screen.getByText(children)).toBeInTheDocument();

    expect(ssgSpy).not.toHaveBeenCalled();
    expect(ssrSpy).not.toHaveBeenCalled();
  });
});
