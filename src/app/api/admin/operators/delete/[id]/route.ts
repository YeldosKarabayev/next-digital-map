import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    context: { params: { id: string } }
) {

    try {
        const operatorId = context.params.id;

        await prisma.point.deleteMany({
            where: { operatorId: operatorId },
        });

        await prisma.operator.delete({
            where: { id: operatorId }
        });

        return NextResponse.json({ message: "Оператор успешно удален!" }, { status: 200 });
        
    } catch (error) {
        console.error("Ошибка удаления:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }

}