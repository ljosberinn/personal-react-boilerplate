export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({}),
    headers: {
      'Content-Type:': 'application/json',
    },
  };
}
