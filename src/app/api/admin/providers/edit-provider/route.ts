import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function PATCH(req: Request) {
  try {
    const { id, name, color } = await req.json();

    // Валидация
    if (!id) {
      return NextResponse.json(
        { error: "ID провайдера обязательно" },
        { status: 400 }
      );
    }

    if (!name && !color) {
      return NextResponse.json(
        { error: "Нужно указать name или color" },
        { status: 400 }
      );
    }

    // Обновление данных
    // const updatedProvider = await prisma.provider.update({
    //   where: { id },
    //   data: {
    //     ...(name && { name }), // Обновляем name, только если оно передано
    //     ...(color && { color }), // Аналогично для color
    //   },
    // });

    const updateData: any = {};
    if(name) updateData.name = name;
    if(color) {
        updateData.color = color;
        updateData.cables = {
            updateMany: {
                where: {  providerId: id },

                data: { color },
            },
        };
    }
    const updatedProvider = await prisma.provider.update({
        where: { id },
        data: updateData,
        include: { cables: true },

    });

    return NextResponse.json(updatedProvider, { status: 200 });

  } catch (error) {
    console.error("Ошибка обновления провайдера:", error);

    // Обработка ошибки "Запись не найдена"
    if (error instanceof Error && error.message.includes("RecordNotFound")) {
      return NextResponse.json(
        { error: "Провайдер не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}