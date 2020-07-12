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
    description,
    images: [
      {
        alt: title,
        height: 600,
        url: 'next-karma-h600.png',
        width: 800,
      },
    ],
    title,
    type: 'website',
  },
  title,
  twitter: {
    cardType: 'summary',
    handle: '@gerrit_alex',
  },
};
