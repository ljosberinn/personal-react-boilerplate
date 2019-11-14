import admin from 'firebase-admin';

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.REACT_APP_PROJECT_ID,
  private_key_id: process.env.REACT_APP_FIRESTORE_PRIVATE_KEY_ID,
  private_key: process.env.REACT_APP_FIRESTORE_PRIVATE_KEY.replace(
    /\\n/g,
    '\n',
  ),
  client_email: process.env.REACT_APP_FIRESTORE_CLIENT_EMAIL,
  client_id: process.env.REACT_APP_FIRESTORE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.REACT_APP_FIRESTORE_CLIENT_X509_CERT_URL,
};

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

export default app;
