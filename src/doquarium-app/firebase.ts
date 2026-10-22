import { getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { parseBackup, type WebBackup } from "./backup";

// Firebase web app "lumora.tools web" in the doquarium-c0f89 project (registered
// 2026-10-22). These values are public by design: access is controlled by the
// Firestore security rules (doquarium repo firestore.rules: a backup can only be
// read by its own Google / Apple account).
const firebaseConfig = {
  apiKey: "AIzaSyAcV1nfC04hgtdK1CL7N4MiTDZjaMnBCis",
  authDomain: "doquarium-c0f89.firebaseapp.com",
  projectId: "doquarium-c0f89",
  storageBucket: "doquarium-c0f89.firebasestorage.app",
  messagingSenderId: "793358965672",
  appId: "1:793358965672:web:15e3e13122c3cacd4bdb9d",
};

const app = getApps()[0] ?? initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export type { User };

export function watchUser(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithPopup(auth, provider);
}

export function signOutWeb() {
  return signOut(auth);
}

/** The phone's latest sign-in backup, or null if this account has none yet */
export async function loadBackup(uid: string): Promise<WebBackup | null> {
  const snap = await getDoc(doc(db, "backups", uid));
  if (!snap.exists()) return null;
  const data = snap.get("data");
  if (!data || typeof data !== "object") return null;
  const updatedAt = snap.get("updatedAt")?.toDate?.() as Date | undefined;
  return parseBackup(data as Record<string, unknown>, updatedAt);
}
