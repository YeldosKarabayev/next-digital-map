import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request){
    try {
        const { name, pointIcon } = await req.json();

        if(!name || !pointIcon) {
            return NextResponse.json({ error: "Missing fields"}, { status: 400 });
        }

        // Generate a UUID for the id field
        const id = crypto.randomUUID();

        const newOperator = await prisma.operator.create({
            data: {
                id,
                name,
                pointIcon,
            },
        });

        return NextResponse.json(newOperator, { status: 201 });

    } catch (error) {
        console.log("Error creating operators:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}