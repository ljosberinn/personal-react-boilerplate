import { DefaultSeoProps } from 'next-seo';

const title = 'Batteries-included Next.js boilerplate';
const description =
  'Personal Next.js boilerplate of Gerrit Alex - includes support for TypeScript, testing, i18n, error handling and auth.';
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
  additionalMetaTags: [
    { content: 'global', name: 'distribution' },
    { content: '7 days', name: 'revisit-after' },
    { content: 'Gerrit Alex', name: 'author' },
    { content: keywords.join(', '), name: 'keywords' },
  ],
  description,
  openGraph: {
    title,
    type: 'website',
  },
  title,
  twitter: {
    cardType: 'summary',
    handle: '@gerrit_alex',
  },
};

export default seo;
