import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import firebase from 'firebase/compat/app';
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || Constants.expoConfig?.extra?.firebase?.apiKey,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || Constants.expoConfig?.extra?.firebase?.authDomain,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || Constants.expoConfig?.extra?.firebase?.projectId,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || Constants.expoConfig?.extra?.firebase?.storageBucket,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || Constants.expoConfig?.extra?.firebase?.messagingSenderId,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || Constants.expoConfig?.extra?.firebase?.appId,
};

console.log('[Firebase] Config loaded', {
  hasApiKey: Boolean(firebaseConfig.apiKey),
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId,
});

// Ensure compat app exists for FirebaseRecaptchaVerifierModal.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
console.log('[Firebase] Compat apps', firebase.apps.map((a) => a.name));

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
console.log('[Firebase] Modular app', app?.name);

let auth;
try {
  auth = getAuth(app);
} catch (err) {
  auth = initializeAuth(app);
}

const db = getFirestore(app);
const functions = getFunctions(app, 'asia-south1');

export { app, auth, db, functions, firebaseConfig };
