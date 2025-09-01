import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://your-project-id.firebaseio.com",
});

export const db = admin.firestore();
