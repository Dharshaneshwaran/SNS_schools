importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCckPHPKw2KJG0sjUztx2WodnaTG61w8kk",
  authDomain: "snserp.firebaseapp.com",
  projectId: "snserp",
  storageBucket: "snserp.firebasestorage.app",
  messagingSenderId: "997693308564",
  appId: "YOUR_WEB_APP_ID" // Update this
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
