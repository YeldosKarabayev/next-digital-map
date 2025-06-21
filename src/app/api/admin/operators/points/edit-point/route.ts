import { prisma } from "@/lib/prisma";
import { log } from "console";
import { NextResponse } from "next/server";


export async function PATCH(req: Request) {
    try {

        const { id, name, description, photoUrl } = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: "ID точки оператора обязательно" },
                { status: 400 }
            );
        }

        if (!name || !description || !photoUrl) {
            return NextResponse.json(
                { error: "Нужно указать name или description или photoUrl" },
                { status: 400 }
            );
        }

        const updateData: {name?: string; description?: string; photoUrl: string} = {
            photoUrl: ""
        };
        
        if(name) updateData.name = name;
        if(description) updateData.description = description;
        if(photoUrl) updateData.photoUrl = photoUrl;

        const updatePoint = await prisma.point.update({
            where: { id },
            data: updateData,
        });
        
        return NextResponse.json(updateData, { status: 200 });

    } catch (error) {
        console.log("Ошибка обновления точки оператора", error);

         if(error instanceof Error && error.message.includes("RecordNotFound")) {
            return NextResponse.json(
                { error: "Точка оператора не найден!" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: "Ошибка сервера" },
            { status: 500 }
        );
    }
}