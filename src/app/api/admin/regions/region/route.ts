
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

    try {
        const regions = await prisma.region.findMany({
            include: {
                areas: {
                    include: {
                        coordinates: true,
                    },
                },
            },
        });

        return NextResponse.json(regions, { status: 200 });
    } catch (error) {
        console.error("Error fetching region:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}