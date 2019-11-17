import firebase from '../utils/firebase';

export async function handler({ queryStringParameters: { lng, ns } }) {
  return {
    statusCode: 200,
    body: JSON.stringify(
      (
        await firebase
          .firestore()
          .collection('locales')
          .doc(lng)
          .collection(ns)
          .get()
      ).docs
        .map(doc => doc.data())
        .reduce((carry, dataset) => ({ ...carry, ...dataset }), {}),
    ),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
