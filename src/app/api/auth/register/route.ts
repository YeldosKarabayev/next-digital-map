import { auth } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password, role } = await req.json();

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await db.collection("users").doc(user.uid).set({
        email,
        role: role || "user",
        createdAt: new Date(),
    });

    return NextResponse.json({ message: "Пользователь зарегистрирован" }, { status: 201 });
}
