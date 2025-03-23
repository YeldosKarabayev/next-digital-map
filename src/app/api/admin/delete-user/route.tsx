import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";



export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    const auth = getAuth();

    // Удаляем пользователя из Firebase Auth
    await auth.deleteUser(userId);

    // Удаляем пользователя из Firestore
    await db.collection("users").doc(userId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка удаления пользователя:", error);
    return NextResponse.json({ success: false, error });
  }
}
