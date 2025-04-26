import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, color } = body;

        if(!name || !color) {
            return NextResponse.json({ error: "Missing name or color" }, { status: 400 });
        }
        const providerRef = await db.collection("providers").add({
            name,
            color,
        });

        const docRef = await db.collection("providers").add({
            name,
            color,
        });

     return NextResponse.json({ id: docRef.id, name, color }, { status: 201 });


    } catch (error) {
        console.error("Error adding provider:", error);
        return NextResponse.json({ success: false, error });
    }

}