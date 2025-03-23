import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
        const {operatorId, name, description, photoUrl, lon, lat} = await req.json();
        if(!operatorId || !name || !description || !lon || !lat){
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        const newPoint = { name, description, photoUrl, lon, lat };
        await db.collection(`operators/${operatorId}/points`).add(newPoint);

        return NextResponse.json({ success: true,  point: newPoint}, { status: 201 });

    } catch (error) {
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
