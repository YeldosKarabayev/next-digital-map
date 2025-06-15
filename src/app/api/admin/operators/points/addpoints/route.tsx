import { db } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//     try{
//         const {operatorId, name, description, photoUrl, lon, lat} = await req.json();
//         if(!operatorId || !name || !description || !lon || !lat){
//             return NextResponse.json({error: "Missing required fields"}, {status: 400});
//         }

//         const newPoint = { name, description, photoUrl, lon, lat };
//         await db.collection(`operators/${operatorId}/points`).add(newPoint);

//         return NextResponse.json({ success: true,  point: newPoint}, { status: 201 });

//     } catch (error) {
//         return NextResponse.json({error: "Internal Server Error"}, {status: 500});
//     }
// }

export async function POST(req: Request) {

    try {
        const  {operatorId, name, description, photoUrl, lon, lat} = await req.json();

        if(!operatorId || !name || !description || !lon || !lat){
            return NextResponse.json({ error: "Missing require fileds" }, { status: 400 });
        }


        const newPoint = await prisma.point.create({
            data: {
                id: crypto.randomUUID(),
                name,
                description,
                photoUrl,
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                operatorId,
            },
        });


        return NextResponse.json(newPoint, { status: 201 });

    } catch (error) {
        console.error("Error creating point:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });        
    }
}