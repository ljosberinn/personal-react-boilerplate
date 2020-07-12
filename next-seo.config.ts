import { DefaultSeoProps } from 'next-seo';

const title = 'next-karma | Next.js template';
const description =
  'next-karma - a slightly opinonated batteries-included Next.js template | Authentication, Internationalization, Error Handling';

export const seo: DefaultSeoProps = {
  additionalMetaTags: [
    { content: 'global', name: 'distribution' },
    { content: '7 days', name: 'revisit-after' },
    { content: 'Gerrit Alex', name: 'author' },
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
