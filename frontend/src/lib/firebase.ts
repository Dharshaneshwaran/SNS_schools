import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase Messaging needs these values; without them getMessaging() throws at import time
// and crashes the whole app. Skip Firebase entirely when config is incomplete.
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
);

if (!isFirebaseConfigured && typeof window !== "undefined") {
  console.warn(
    "[firebase] NEXT_PUBLIC_FIREBASE_* env vars are missing; push notifications are disabled."
  );
}

const app: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

let messaging: Messaging | null = null;

// Lazily initialise messaging only in supported browsers (needs service workers, HTTPS/localhost, etc.)
const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (messaging) return messaging;
  if (!app || typeof window === "undefined") return null;
  try {
    if (!(await isSupported())) return null;
    messaging = getMessaging(app);
    return messaging;
  } catch (err) {
    console.warn("[firebase] Messaging unavailable:", err);
    return null;
  }
};

export { app, messaging, getMessagingInstance };

export const requestForToken = async () => {
  const messaging = await getMessagingInstance();
  if (!messaging) return null;

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    if (currentToken) {
      console.log("Current token for client: ", currentToken);
      return currentToken;
    } else {
      console.log("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    getMessagingInstance().then((messaging) => {
      if (!messaging) return;
      onMessage(messaging, (payload) => {
        console.log("Payload received: ", payload);
        resolve(payload);
      });
    });
  });
