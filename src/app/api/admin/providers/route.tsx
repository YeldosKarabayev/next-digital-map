import {db} from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    // try {
    //     console.log("Request URL:", req.url);

    //     const { searchParams } = new URL(req.url);
    //     const providerId = searchParams.get("providerId");

    //     console.log("Extracted providerId:", providerId);
        
    //     if(!providerId) {
    //         return NextResponse.json({ error: "Missing providerId" }, { status: 400 });
    //     }

    //     const providerDoc = await db.collection("providers").doc(providerId).get();
    //     if (!providerDoc.exists) {
    //         return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    //     }

    //     const provider = { id: providerDoc.id, ...providerDoc.data() };
    //     console.log("Fetched provider:", provider);

    //     const cablesSnapshot = await db.collection(`providers/${providerId}/cables`).get();
    //     const cables = cablesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //     console.log("Fetched cables:", cables);

    //     return NextResponse.json({ ...provider, cables }, { status: 200 });
        
    // } catch (error) {
    //    console.error("Error fetching data:", error);
    //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 }); 
    // }


    const snapshot = await db.collection("providers").get();
    const providers = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const providersSnapshot = await db.collection(`providers/${doc.id}/cables`).get();
            const providers = providersSnapshot.docs.map(providerDoc => ({
                id: providerDoc.id,
                ...providerDoc.data(),
            }))

            return { id: doc.id, ...doc.data(), providers };
        })
    );
    return NextResponse.json(providers, { status: 200 });
};