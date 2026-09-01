import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore using the provisioned databaseId
export const firestoreDb = initializeFirestore(
  firebaseApp,
  {},
  firebaseConfig.firestoreDatabaseId || '(default)'
);
