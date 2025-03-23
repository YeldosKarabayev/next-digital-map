import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";


export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();
    const auth = getAuth();

    // Создаем пользователя в Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // Сохраняем роль в Firestore
    await db.collection("users").doc(userRecord.uid).set({
      email,
      role,
    });

    return NextResponse.json({ success: true, userId: userRecord.uid });
  } catch (error) {
    console.error("Ошибка добавления пользователя:", error);
    return NextResponse.json({ success: false, error });
  }
}
