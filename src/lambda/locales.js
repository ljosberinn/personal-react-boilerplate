import firebase from '../utils/firebase';

export async function handler({ queryStringParameters: { lng, ns } }) {
  const languages = lng.split(' ');
  const namespaces = ns.split(' ');

  const body = languages.reduce((carry, lng) => {
    return {
      ...carry,
      [lng]: namespaces.reduce((carry, ns) => {
        return { ...carry, [ns]: {} };
      }, {}),
    };
  }, {});

  const localesRef = firebase.firestore().collection('locales');

  await Promise.all(
    languages.map(async lng => {
      const lngRef = localesRef.doc(lng);

      await Promise.all(
        namespaces.map(async ns => {
          body[lng][ns] = (await lngRef.collection(ns).get()).docs
            .map(doc => doc.data())
            .reduce((carry, dataset) => ({ ...carry, ...dataset }), {});
        }),
      );
    }),
  );

  return {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
