// backend/src/firebase.ts
import admin from "firebase-admin";
import path from "path";
import fs from "fs";

const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vocalcart-aabf6-default-rtdb.firebaseio.com",
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
