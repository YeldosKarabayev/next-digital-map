import { db } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//     try {
//         console.log("Request URL:", req.url);

//         const { searchParams } = new URL(req.url);
//         const providerId = searchParams.get("providerId");

//         console.log("Extracted providerId:", providerId);

//         if (!providerId) {
//             return NextResponse.json({ error: "Missing providerId" }, { status: 400 });
//         }

//         const providerDoc = await db.collection("providers").doc(providerId).get();
//         if (!providerDoc.exists) {
//             return NextResponse.json({ error: "Provider not found" }, { status: 404 });
//         }

//         const provider = { id: providerDoc.id, ...providerDoc.data() };

//         const cablesSnapshot = await db.collection(`providers/${providerId}/cables`).get();
//         const cables = cablesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()} ));

//         console.log("Fetched cables:", cables);
//         return NextResponse.json({ ...provider, cables }, { status: 200 });


//     } catch (error) {
//         console.error("Error fetching data:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     } 
// }

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const providerId = searchParams.get("providerId");

        if(!providerId) {
            return NextResponse.json({ error: "Провайдер не найден!"}, { status: 400 });
        }

        const provider = await prisma.provider.findUnique({
            where: { id: providerId },
            include: { cables: true }
        });

        if(!provider){
            return NextResponse.json({ error: "Провайдер не найден!"}, {status: 200});
        }

        return NextResponse.json(provider, {status: 200});

    } catch (error) {
        console.error("Error fetching provider with cables:", error);
        return NextResponse.json({ error: "Server Error:"}, {status: 500});
    }
}