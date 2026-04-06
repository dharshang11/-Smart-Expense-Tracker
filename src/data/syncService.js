import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, doc, setDoc, deleteDoc,
  getDocs, query, writeBatch
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig, { isFirebaseConfigured } from './firebaseConfig';
import db from './db';

let firebaseApp = null;
let firestore = null;
let auth = null;
let userId = null;

function getFirebaseApp() {
  if (!firebaseApp && isFirebaseConfigured()) {
    firebaseApp = initializeApp(firebaseConfig);
    firestore = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
  }
  return { firebaseApp, firestore, auth };
}

export async function initSync() {
  if (!isFirebaseConfigured()) return { success: false, error: 'Firebase not configured' };

  try {
    const { auth } = getFirebaseApp();
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          userId = user.uid;
          resolve({ success: true, userId });
        } else {
          try {
            const cred = await signInAnonymously(auth);
            userId = cred.user.uid;
            resolve({ success: true, userId });
          } catch (err) {
            resolve({ success: false, error: err.message });
          }
        }
      });
    });
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function pushToCloud() {
  if (!userId || !firestore) return { success: false, error: 'Not connected' };

  try {
    const expenses = await db.expenses.toArray();
    const batch = writeBatch(firestore);
    const colRef = collection(firestore, `users/${userId}/expenses`);

    for (const expense of expenses) {
      const docRef = doc(colRef, String(expense.id));
      batch.set(docRef, {
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        notes: expense.notes,
        source: expense.source,
        createdAt: expense.createdAt,
      });
    }

    // Also sync settings
    const settings = await db.settings.toArray();
    const settingsRef = collection(firestore, `users/${userId}/settings`);
    for (const setting of settings) {
      const sDocRef = doc(settingsRef, setting.key);
      batch.set(sDocRef, { value: setting.value });
    }

    await batch.commit();
    return { success: true, count: expenses.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function pullFromCloud() {
  if (!userId || !firestore) return { success: false, error: 'Not connected' };

  try {
    const colRef = collection(firestore, `users/${userId}/expenses`);
    const snapshot = await getDocs(query(colRef));

    await db.transaction('rw', db.expenses, async () => {
      await db.expenses.clear();
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        await db.expenses.add({
          amount: data.amount,
          category: data.category,
          date: data.date,
          notes: data.notes || '',
          source: data.source || 'cash',
          createdAt: data.createdAt || new Date().toISOString(),
        });
      }
    });

    // Pull settings
    const settingsRef = collection(firestore, `users/${userId}/settings`);
    const settingsSnap = await getDocs(query(settingsRef));
    for (const sDoc of settingsSnap.docs) {
      await db.settings.put({ key: sDoc.id, value: sDoc.data().value });
    }

    return { success: true, count: snapshot.size };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function isSyncAvailable() {
  return isFirebaseConfigured();
}
