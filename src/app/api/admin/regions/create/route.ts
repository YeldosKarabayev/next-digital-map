import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        const { name, color, coordinates } = await req.json();

        if (!name || !color || !Array.isArray(coordinates) || coordinates.length < 3) {
            return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
        }

        const id = crypto.randomUUID();

        const newRegion = await prisma.region.create({
            data: {
                id,
                name,
                color,
                coordinates: {
                    create: coordinates.map((coord: { lat: number; lng: number }) => ({
                        lat: coord.lat,
                        lon: coord.lng,
                    })),
                },
            },
            include: {
                coordinates: true,
            },
        });

        return NextResponse.json(newRegion, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}