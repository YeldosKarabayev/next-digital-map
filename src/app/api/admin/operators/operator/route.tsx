import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

// export async function GET() {
//     try {
//         // Загружаем всех операторов
//         const operatorsSnapshot = await db.collection("operators").get();
//         const operators = await Promise.all(
//             operatorsSnapshot.docs.map(async (operatorDoc) => {
//                 const operatorData = { id: operatorDoc.id, ...operatorDoc.data() };

//                 // Загружаем точки для каждого оператора
//                 const pointsSnapshot = await db
//                     .collection(`operators/${operatorDoc.id}/points`)
//                     .get();
//                 const points = pointsSnapshot.docs.map((doc) => {
//                     const data = doc.data();
//                     return {
//                         id: doc.id,
//                         name: data.name,
//                         description: data.description,
//                         photoUrl: data.photoUrl,
//                         coordinates: [parseFloat(data.lon), parseFloat(data.lat)] // Преобразуем в числа
//                     };
//                 });

//                 return { ...operatorData, points };
//             })
//         );

//         return NextResponse.json(operators, { status: 200 });
//     } catch (error) {
//         console.error("Ошибка при загрузке операторов:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }


export async function GET() {
    const snapshot = await db.collection("operators").get();
    const operators = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const pointsSnapshot = await db.collection(`operators/${doc.id}/points`).get();
            const points = pointsSnapshot.docs.map(pointDoc => ({
                id: pointDoc.id,
                ...pointDoc.data(),
            }))

            return { id: doc.id, ...doc.data(), points};
        })
    );

    return NextResponse.json(operators, { status: 200 });
}