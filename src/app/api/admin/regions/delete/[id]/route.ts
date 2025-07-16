import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    context: { params: { id: string } }
) {
    try {
        const regionId = context.params.id;

        await prisma.regionCoordinate.deleteMany({
            where: { regionId: regionId },
        });

        await prisma.region.delete({
            where: { id: regionId }
        });

        return NextResponse.json({ message: "Регион успешно удален!" } , { status: 200 });

    } catch (error) {
        console.error("Ошибка удаления:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}