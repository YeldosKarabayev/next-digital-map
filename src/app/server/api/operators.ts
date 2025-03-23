import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Добавить точку оператора связи
export const addOperatorPoint = async (operatorId: string, pointData: any) => {
  try {
    const docRef = await addDoc(collection(db, `operators/${operatorId}/points`), pointData);
    console.log("Точка добавлена с ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Ошибка добавления точки:", error);
  }
};

// Получить все точки
export const getOperatorPoints = async (operatorId: string) => {
  const querySnapshot = await getDocs(collection(db, `operators/${operatorId}/points`));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
