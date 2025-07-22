import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const { id, name, color } = await req.json();

        if(!id) {
            return NextResponse.json(
                {error: "ID оператора обязательно!"},
                { status: 400 }
            );
        }

        if(!name || !color ) {
            return NextResponse.json(
                { error: "Нужно указать name или color!"},
                { status: 400 }
            );
        }

        const updateData: { name?: string; color?: string } = {};
        if(name) updateData.name   = name;
        if(color) updateData.color = color;

        const updateRegion = await prisma.region.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updateData, { status: 200 });

    } catch (error) {
        console.error("Ошибка обнавления оператора!", error);

        if(error instanceof Error && error.message.includes("RecordNotFound")) {
            return NextResponse.json(
                { error: "Оператор не найден!" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: "Server Error" },
            { status: 500 }
        );
    }
}