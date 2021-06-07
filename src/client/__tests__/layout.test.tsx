import { render } from '../../../testUtils';
import { i18nCache } from '../../../testUtils/i18n';
import { FALLBACK_LANGUAGE } from '../../constants';
import * as Isomorphic from '../karma/Isomorphic';
import { layoutWithKarma } from '../karma/layout';
import type { LayoutCreator } from '../karma/layout';
import type { IsomorphicKarmaProps } from '../karma/types';

function MockPage() {
  return <h1>dummy</h1>;
}
const mockLayout: LayoutCreator = (page) => (
  <div data-testid="page">{page}</div>
);

const mockProps: IsomorphicKarmaProps = {
  auth: {
    redirectDestinationIfUnauthenticated: '',
    session: null,
    shouldAttemptReauthentication: false,
  },
  cookies: '',
  i18n: {
    locale: FALLBACK_LANGUAGE,
    resources: i18nCache,
  },
};

describe('layoutWithKarma', () => {
  test('composes LayoutCreator with given page', () => {
    const MockPage = jest.fn().mockImplementationOnce(() => <h1>page</h1>);
    const mockLayout = jest
      .fn()
      .mockImplementationOnce((page) => <div data-testid="page">{page}</div>);

    const withLayout = layoutWithKarma(mockLayout);

    const mockedReactElement = <MockPage />;

    render(withLayout(mockedReactElement, mockProps), {
      omitKarmaProvider: true,
    });

    expect(MockPage).toHaveBeenCalledTimes(1);
    expect(MockPage).toHaveBeenCalledWith({}, {});

    expect(mockLayout).toHaveBeenCalledTimes(1);
    expect(mockLayout).toHaveBeenCalledWith(mockedReactElement);
  });

  test('forwards karma props onto IsomorphicKarma', () => {
    const isoSpy = jest.spyOn(Isomorphic, 'IsomorphicKarma');

    const withLayout = layoutWithKarma(mockLayout);

    render(withLayout(<MockPage />, mockProps), {
      omitKarmaProvider: true,
    });

    expect(isoSpy).toHaveBeenCalledTimes(1);
    expect(isoSpy).toHaveBeenCalledWith(
      {
        children: mockLayout(<MockPage />),
        karma: mockProps,
      },
      {}
    );
  });
});
