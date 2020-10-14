import { testA11Y, validateHtml } from '../../../testUtils';
import { DocsIndex } from '../routes/Docs';

describe('<DocsIndex />', () => {
  it('passes a11y test', async () => {
    await testA11Y(<DocsIndex />);
  });

  it('contains valid html', () => {
    validateHtml(<DocsIndex />);
  });
});
