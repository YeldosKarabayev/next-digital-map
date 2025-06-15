import { db } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// export async function GET() {
//     const snapshot = await db.collection("operators").get();
//     const operators = await Promise.all(
//         snapshot.docs.map(async (doc) => {
//             const pointsSnapshot = await db.collection(`operators/${doc.id}/points`).get();
//             const points = pointsSnapshot.docs.map(pointDoc => ({
//                 id: pointDoc.id,
//                 ...pointDoc.data(),
//             }))

//             return { id: doc.id, ...doc.data(), points};
//         })
//     );

//     return NextResponse.json(operators, { status: 200 });
// }

export async function GET() {
    try {
        const operators = await prisma.operator.findMany({
            include: {
                points: true,
            },
        });

        return NextResponse.json(operators, { status:200 });

    } catch (error) {
        console.log("Ошибка при получения операторов:", error);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}