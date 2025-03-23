import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, role } = await req.json();

        if (!userId || !role) {
            return NextResponse.json({ message: "Неверные данные" }, { status: 400 });
        }

        await db.collection("users").doc(userId).update({ role });

        return NextResponse.json({ message: "Роль обновлена" }, { status: 200 });
    } catch (error) {
        console.error("Ошибка обновления роли:", error);
        return NextResponse.json({ message: "Ошибка сервера", error: error }, { status: 500 });
    }
}
