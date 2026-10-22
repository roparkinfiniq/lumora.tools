/// <reference types="vite/client" />
import { getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  OAuthProvider,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  connectFirestoreEmulator,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { parseBackup, type NoteKind, type WebBackup, type WebNote } from "./backup";

/** `VITE_DOQ_EMULATOR=1 npm run dev`: talk to local Firebase emulators (auth 9099, firestore 8080) for testing */
const EMULATOR = import.meta.env.VITE_DOQ_EMULATOR === "1";

// Firebase web app "lumora.tools web" in the doquarium-c0f89 project (registered
// 2026-10-22). These values are public by design: access is controlled by the
// Firestore security rules (doquarium repo firestore.rules: a backup can only be
// read by its own Google / Apple account, and only its owner can drop notes into
// their mailbox).
const firebaseConfig = {
  apiKey: "AIzaSyAcV1nfC04hgtdK1CL7N4MiTDZjaMnBCis",
  authDomain: "doquarium-c0f89.firebaseapp.com",
  projectId: EMULATOR ? "demo-doquarium" : "doquarium-c0f89", // demo-*: the emulators never reach the real project
  storageBucket: "doquarium-c0f89.firebasestorage.app",
  messagingSenderId: "793358965672",
  appId: "1:793358965672:web:15e3e13122c3cacd4bdb9d",
};

/**
 * Writing from the web (step 2). On since the app update that reads the
 * mailbox (+19, 래원 결정 2026-10-23); each person also needs their phone on
 * that build (MIN_APP_BUILD). Build with VITE_DOQ_WEB_WRITES=0 to switch it off.
 */
export const WEB_WRITES = EMULATOR || import.meta.env.VITE_DOQ_WEB_WRITES !== "0";

const app = getApps()[0] ?? initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
if (EMULATOR) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

export type { User };

export function watchUser(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  // The auth emulator takes an unsigned test token: a pretend Google account, no popup
  if (EMULATOR) {
    await signInWithCredential(auth, GoogleAuthProvider.credential(JSON.stringify({ sub: "web-tester", email: "tester@example.com" })));
    return;
  }
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithPopup(auth, provider);
}

/** Sign in with Apple (web: Services ID com.lumora.doquarium.web in the Firebase Apple provider, set up 2026-10-23) */
export async function signInWithApple() {
  if (EMULATOR) {
    await signInWithCredential(auth, new OAuthProvider("apple.com").credential({ idToken: JSON.stringify({ sub: "web-apple-tester", email: "apple-tester@example.com" }) }));
    return;
  }
  const provider = new OAuthProvider("apple.com");
  provider.addScope("email");
  provider.setCustomParameters({ locale: document.documentElement.lang === "ko" ? "ko_KR" : "en_US" });
  await signInWithPopup(auth, provider);
}

export function signOutWeb() {
  return signOut(auth);
}

/** The phone's latest sign-in backup, live (null if this account has none yet) */
export function watchBackup(uid: string, cb: (backup: WebBackup | null) => void, onError: (e: unknown) => void) {
  return onSnapshot(
    doc(db, "backups", uid),
    (snap) => {
      const data = snap.exists() ? snap.get("data") : null;
      if (!data || typeof data !== "object") return cb(null);
      const updatedAt = snap.get("updatedAt")?.toDate?.() as Date | undefined;
      cb(parseBackup(data as Record<string, unknown>, updatedAt));
    },
    onError,
  );
}

const KINDS: NoteKind[] = ["add", "done", "undo", "edit", "delete", "category"];
const str = (v: unknown) => (typeof v === "string" ? v : undefined);

/** Notes in my mailbox that the phone hasn't applied yet, live */
export function watchInbox(uid: string, cb: (notes: WebNote[]) => void) {
  return onSnapshot(
    query(collection(db, "inbox", uid, "notes"), orderBy("at")),
    (snap) =>
      cb(
        snap.docs.flatMap((d) => {
          const v = d.data();
          if (!KINDS.includes(v.kind) || typeof v.tank !== "string" || typeof v.at !== "number") return [];
          return [{ id: d.id, kind: v.kind, tank: v.tank, at: v.at, todo: str(v.todo), title: str(v.title), category: str(v.category), name: str(v.name) }];
        }),
      ),
    () => cb([]),
  );
}

/** Drop a note into my mailbox (only the fields its kind allows, see firestore.rules validNote) */
export async function sendNote(uid: string, note: WebNote) {
  const { id, ...rest } = note;
  const data: Record<string, unknown> = { createdAt: serverTimestamp() };
  for (const [k, v] of Object.entries(rest)) if (v !== undefined) data[k] = v;
  await setDoc(doc(db, "inbox", uid, "notes", id), data);
}
