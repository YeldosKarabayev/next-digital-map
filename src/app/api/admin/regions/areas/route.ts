
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const regionId = searchParams.get("regionId");

        if (!regionId) {
            return NextResponse.json({ error: "Region ID is required" }, { status: 400 });
        }

        const areas = await prisma.area.findMany({
            where: { regionId: regionId },
            include: {
                coordinates: true,
            },
        });

        if (!areas || areas.length === 0) {
            return NextResponse.json({ error: "No areas found for this region" }, { status: 404 });
        }

        return NextResponse.json(areas, { status: 200 });

    } catch (error) {
        console.error("Error fetching areas:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
