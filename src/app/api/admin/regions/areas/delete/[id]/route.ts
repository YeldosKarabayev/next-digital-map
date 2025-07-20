import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    context: { params: { id: string}}
) {
    try {
        const id = context.params.id;

        await prisma.area.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Область успешно удален!" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Ошибка при удалении области" }, { status: 500 });
    }
}