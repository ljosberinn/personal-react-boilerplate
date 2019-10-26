import { useCallback } from 'react';
import { auth } from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function useAuth() {
  const [user, isLoading, error] = useAuthState(auth());

  const login = useCallback(async (mail, password) => {
    await auth().signInWithEmailAndPassword(mail, password);
  }, []);

  const logout = useCallback(async () => {
    await auth().signOut();
  }, []);

  const register = useCallback(async (mail, password) => {
    await auth().createUserWithEmailAndPassword(mail, password);
  }, []);

  const sendPasswordResetMail = useCallback(async mail => {
    await auth().sendPasswordResetEmail(mail);
    return true;
  }, []);

  const confirmPasswordReset = useCallback(async (code, password) => {
    await auth().confirmPasswordReset(code, password);
    return true;
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    register,
    sendPasswordResetMail,
    confirmPasswordReset,
  };
}
