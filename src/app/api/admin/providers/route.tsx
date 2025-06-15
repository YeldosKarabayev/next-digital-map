import {db} from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//     const snapshot = await db.collection("providers").get();
//     const providers = await Promise.all(
//         snapshot.docs.map(async (doc) => {
//             const providersSnapshot = await db.collection(`providers/${doc.id}/cables`).get();
//             const providers = providersSnapshot.docs.map(providerDoc => ({
//                 id: providerDoc.id,
//                 ...providerDoc.data(),
//             }))

//             return { id: doc.id, ...doc.data(), providers };
//         })
//     );
//     return NextResponse.json(providers, { status: 200 });
// };

export async function GET() {
    try {
        const providers = await prisma.provider.findMany({
            include: {
                cables: {
                    include: {
                        coordinates: true,
                    },
                },
            },
        });

        return NextResponse.json(providers, { status:200 });
    } catch (error) {
        console.error("Ошибка при получении провайдеров:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}