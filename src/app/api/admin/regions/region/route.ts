
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

    try {
        const region = await prisma.region.findMany({
           include: {
                coordinates: true,
           },
        });

        if (!region) {
            return NextResponse.json({ error: "Region not found" }, { status: 404 });
        }

        return NextResponse.json(region, { status: 200 });
    } catch (error) {
        console.error("Error fetching region:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}