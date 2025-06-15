import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";


export async function DELETE(
    req: Request,
    context: { params: { id: string }}
) {
    try {
        const id = context.params.id

        await prisma.point.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Точка оператора успешно удален!"}, { status: 200});

    } catch (error) {
        console.error("Ошибка удаления:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}