import { db } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//     try {
//         console.log("Request URL:", req.url);

//         const { searchParams } = new URL(req.url);
//         const operatorId = searchParams.get("operatorId");

//         console.log("Extracted operatorId:", operatorId);

//         if (!operatorId) {
//             return NextResponse.json({ error: "Missing operatorId" }, { status: 400 });
//         }

//         // Проверяем, существует ли оператор
//         const operatorDoc = await db.collection("operators").doc(operatorId).get();
//         if (!operatorDoc.exists) {
//             return NextResponse.json({ error: "Operator not found" }, { status: 404 });
//         }

//         const operator = { id: operatorDoc.id, ...operatorDoc.data() };

//         // Загружаем точки
//         const pointsSnapshot = await db.collection(`operators/${operatorId}/points`).get();
//         const points = pointsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//         console.log("Fetched points:", points);

//         return NextResponse.json({ ...operator, points }, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const operatorId = searchParams.get("operatorId");

        if (!operatorId) {
            return NextResponse.json(
                {
                    error: "Оператор не найден!"
                },
                {
                    status: 400
                }
            );
        }

        const operator = await prisma.operator.findUnique({
            where: {id: operatorId},
            include: {points: true}
        });

        if(!operator){
            return NextResponse.json({ error: "Operator not found"}, { status: 404});
        }

        return NextResponse.json(operator, {status: 200});

    } catch(error) {
        console.log("Error fetching operator with points:", error);
        return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
    }
}