import { useCallback } from 'react';
import { auth } from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function useAuth() {
  const [user, isLoading, error] = useAuthState(auth());

  const registerWithMailAndPassword = useCallback(async (mail, password) => {
    await auth().createUserWithEmailAndPassword(mail, password);
  }, []);

  const loginWithMailAndPassword = useCallback(async (mail, password) => {
    await auth().signInWithEmailAndPassword(mail, password);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await auth().signInWithPopup(new auth.GoogleAuthProvider());
  }, []);

  const sendMailVerification = useCallback(async () => {
    await auth().currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_MAIL_PATH,
    });
  }, []);

  const logout = useCallback(async () => {
    await auth().signOut();
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
    loginWithMailAndPassword,
    registerWithMailAndPassword,
    loginWithGoogle,
    sendMailVerification,
    logout,
    sendPasswordResetMail,
    confirmPasswordReset,
  };
}
