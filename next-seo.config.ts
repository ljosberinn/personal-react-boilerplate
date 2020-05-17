import { DefaultSeoProps } from 'next-seo';

const title = 'Batteries-included Next.js boilerplate';
const description =
  'Personal React boilerplate of Gerrit Alex - includes support for TypeScript, testing, i18n, error handling and auth.';
const keywords = [
  'next.js',
  'react',
  'boilerplate',
  'typescript',
  'i18n',
  'auth',
  'testing',
];

const seo: DefaultSeoProps = {
  title,
  description,
  openGraph: {
    type: 'website',
    title,
  },
  twitter: {
    handle: '@gerrit_alex',
    cardType: 'summary',
  },
  additionalMetaTags: [
    { name: 'distribution', content: 'global' },
    { name: 'revisit-after', content: '7 days' },
    { name: 'author', content: 'Gerrit Alex' },
    { name: 'keywords', content: keywords.join(', ') },
  ],
};

export default seo;
