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
          const nsData = await lngRef.collection(ns).get();

          nsData.forEach(doc => {
            const data = doc.data();

            body[lng][ns] = data;
          });
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
