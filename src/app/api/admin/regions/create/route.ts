import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {


    const { regionId, areaName, color, areas } = await req.json();

    if (!regionId || !Array.isArray(areas)) {
        return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
    }

    try {
        // Проверим, существует ли регион
        const existingRegion = await prisma.region.findUnique({
            where: { id: regionId },
        });

        if (!existingRegion) {
            return NextResponse.json({ error: "Регион не найден" }, { status: 404 });
        }

        // Добавим области к существующему региону
        const area = await prisma.area.create({
            data: {
                id: crypto.randomUUID(),
                name: areaName,
                regionId,
                coordinates: {
                    create: areas.map((p: {
                        lng: number; lat: number; lon: number
                    }) => ({
                        lat: p.lat,
                        lon: p.lon ?? p.lng,
                    })),
                }
            }
        });

        return NextResponse.json({ message: "Области добавлены", area }, { status: 201 });

    } catch (error) {
        console.error("Ошибка при добавлении областей:", error);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }

}