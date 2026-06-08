import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAwd6AUrzQzHS41m060mNAFf8G7USi1_E0',
  authDomain: 'hebrewwordle.firebaseapp.com',
  projectId: 'hebrewwordle',
  storageBucket: 'hebrewwordle.firebasestorage.app',
  messagingSenderId: '677574512433',
  appId: '1:677574512433:android:7804a9c319bfe3ca096a10',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
