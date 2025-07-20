import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, color } = await req.json();

        if (!name || !color) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const id = crypto.randomUUID();

        const newRegion = await prisma.region.create({
            data: {
                id,
                name,
                color
            }
        });

        return NextResponse.json(newRegion, { status: 201 });
        
    } catch (error) {
        console.error("Error creating region:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
}