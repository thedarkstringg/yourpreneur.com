import {
  GithubAuthProvider,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword as updateFirebasePassword,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';
import { useStore } from './useStore';

type OAuthProvider = 'github' | 'google';

const toStoreUser = (user: User, fallbackName = 'Founder') => ({
  id: user.uid,
  email: user.email || '',
  fullName: user.displayName || fallbackName,
  tier: 'free' as const,
});

const friendlyAuthError = (error: unknown, fallback: string) => {
  if (!(error instanceof Error) || !('code' in error)) return fallback;

  const code = String((error as { code?: unknown }).code);

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email already has an account.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid credentials.';
    case 'auth/weak-password':
      return 'Password too weak. Use at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Sign in cancelled.';
    case 'auth/popup-blocked':
      return 'Pop-up blocked. Please allow pop-ups and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'This email is already registered with another sign-in method.';
    case 'auth/too-many-requests':
      return 'Too many login attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return fallback;
  }
};

export const useAuth = () => {
  const { setUser, clearAuth, setAuthLoading } = useStore();

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: fullName });

      setUser({
        id: credential.user.uid,
        email: credential.user.email || '',
        fullName,
        tier: 'free',
      });
      return { success: true, user: credential.user };
    } catch (error) {
      throw new Error(friendlyAuthError(error, 'Sign up failed.'));
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(auth, email, password);
      setUser(toStoreUser(credential.user));
      return { success: true, user: credential.user };
    } catch (error) {
      throw new Error(friendlyAuthError(error, 'Invalid credentials.'));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      throw new Error(friendlyAuthError(error, 'Password reset failed.'));
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      if (!auth.currentUser) throw new Error('No authenticated user.');
      await updateFirebasePassword(auth.currentUser, newPassword);
      return { success: true };
    } catch (error) {
      throw new Error(friendlyAuthError(error, 'Password update failed.'));
    }
  };

  const signInWithProvider = async (provider: OAuthProvider) => {
    try {
      const firebaseProvider = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      const credential = await signInWithPopup(auth, firebaseProvider);
      setUser(toStoreUser(credential.user));
      return { success: true, user: credential.user };
    } catch (error) {
      throw new Error(friendlyAuthError(error, 'OAuth authentication failed.'));
    }
  };

  const logOut = async () => {
    await signOut(auth);
    clearAuth();
    return { success: true };
  };

  const checkSession = async () => {
    setAuthLoading(true);

    return new Promise<{ authenticated: boolean; user?: User }>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();

        if (user) {
          setUser(toStoreUser(user));
          resolve({ authenticated: true, user });
        } else {
          clearAuth();
          setAuthLoading(false);
          resolve({ authenticated: false });
        }
      });
    });
  };

  return {
    signUp,
    signIn,
    resetPassword,
    updatePassword,
    signInWithProvider,
    logOut,
    checkSession,
  };
};
