import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './config';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID', // from Firebase console → Project Settings → Web API Key
});

export async function signInWithGoogle(): Promise<User | null> {
  try {
    await GoogleSignin.hasPlayServices();
    const { data } = await GoogleSignin.signIn();
    if (!data?.idToken) throw new Error('No ID token');
    const credential = GoogleAuthProvider.credential(data.idToken);
    const result = await signInWithCredential(auth, credential);
    return result.user;
  } catch (error) {
    console.error('Google sign in error:', error);
    return null;
  }
}

export async function signOut(): Promise<void> {
  await GoogleSignin.signOut();
  await firebaseSignOut(auth);
}

export { onAuthStateChanged, auth };
