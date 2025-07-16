import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { collection, doc, getDocs, setDoc, addDoc } from "firebase/firestore";

// ✅ Firebase Admin должен выполняться ТОЛЬКО на сервере
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

export const db = getFirestore();

const auth = getAuth();

export const getUsers = async () => {
  const snapshot = await db.collection("users").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateUserRole = async (userId: string, newRole: any) => {
  await db.collection("users").doc(userId).update({ role: newRole });
};

export const addUser = async ({ email, role, password }: { email: string; role: string; password: string }) => {
  const userRecord = await auth.createUser({ email, password }); // 👈 Создаём пользователя
  await db.collection("users").doc(userRecord.uid).set({ email, role });
};

export const deleteUser = async (userId: string) => {
  await auth.deleteUser(userId);
  await db.collection("users").doc(userId).delete();
};

export async function getOperators(db: any) {
  const operatorsRef = collection(db, "operators"); // 👈 Получаем коллекцию операторов
  const snapshot = await getDocs(operatorsRef); // 👈 Получаем снимок коллекции
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // 👈 Возвращаем массив операторов
}

