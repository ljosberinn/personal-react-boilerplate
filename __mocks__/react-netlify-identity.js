import React, { createContext } from 'react';

const instantlyResolvedPromise = () => Promise.resolve({});

const defaultConfig = {
  setSettings: jest.fn(),
  setUser: jest.fn(),
  signupUser: instantlyResolvedPromise,
  loginUser: instantlyResolvedPromise,
  logoutUser: instantlyResolvedPromise,
  requestPasswordRecovery: instantlyResolvedPromise,
  recoverAccount: instantlyResolvedPromise,
  updateUser: instantlyResolvedPromise,
  getFreshJWT: instantlyResolvedPromise,
  authedFetch: {
    get: instantlyResolvedPromise,
    post: instantlyResolvedPromise,
    patch: instantlyResolvedPromise,
    put: instantlyResolvedPromise,
  },
  loginProvider: jest.fn(),
  acceptInviteExternalUrl: instantlyResolvedPromise,
  verifyToken: instantlyResolvedPromise,
  isConfirmedUser: false,
  isLoggedIn: false,
  user: {},
  _url: '',
  param: {
    token: undefined,
    type: undefined,
    error: undefined,
    status: undefined,
  },
};

const Context = createContext(defaultConfig);

export function IdentityContextProvider({ url, children }) {
  return (
    <Context.Provider value={{ ...defaultConfig, _url: url }}>
      {children}
    </Context.Provider>
  );
}
