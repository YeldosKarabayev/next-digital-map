import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";



export async function PATCH(req: Request) {
    try {
        const { id, name, pointIcon } = await req.json();

        if(!id) {
            return NextResponse.json(
                { error: "ID оператора обязательно" },
                { status: 400 }
            );
        }

        if(!name || ! pointIcon ) {
            return NextResponse.json(
                { error: "Нужно указать name или pointUrl"},
                { status: 400 }
            );
        }

       // Подготовка данных для обновления
        const updateData: { name?: string; pointIcon?: string } = {};
        if (name) updateData.name = name;
        if (pointIcon) updateData.pointIcon = pointIcon;

        // Обновление оператора
        const updatedOperator = await prisma.operator.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedOperator, { status: 200 });

    } catch (error) {
        console.error("Ошибка обнавления опреатора:", error);

        if(error instanceof Error && error.message.includes("RecordNotFound")) {
            return NextResponse.json(
                { error: "Оператора не найден!" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: "Ошибка сервера" },
            { status: 500 }
        );
    }
}