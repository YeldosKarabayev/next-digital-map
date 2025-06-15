import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";


export async function POST(req: Request) {

    try {
        const { operatorId, street, path, color } = await req.json();

        if (!operatorId || !street || !color || !Array.isArray(path) || path.length < 2) {
            return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
        }

        const id = crypto.randomUUID();

        const cable = await prisma.cable.create({
            data: {
                id,
                street,
                color,
                createdAt: new Date(),
                provider: {
                    connect: { id: operatorId }
                },
                coordinates: {
                    create: path.map((p: {
                        lng: number; lat: number; lon: number
                    }) => ({
                        lat: p.lat,
                        lon: p.lon ?? p.lng,
                    })),
                },
            },
            include: {
                coordinates: true,
            },
        });

        return NextResponse.json(cable, { status: 201 });

    } catch (error) {
        console.error("Ошибка при добавлении кабеля", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}