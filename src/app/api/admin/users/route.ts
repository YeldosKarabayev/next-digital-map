import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(users, { status: 200 });
}
