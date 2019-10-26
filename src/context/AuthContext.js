import React, { createContext } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { useAuth } from '../hooks';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

firebase.initializeApp(config);

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={useAuth()}>{children}</AuthContext.Provider>
  );
}
