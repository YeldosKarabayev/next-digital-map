import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { pointId: string } }
) {
  try {
    const { pointId } = params;
    
    // Добавим логирование для отладки
    console.log('Fetching point with ID:', pointId);
    
    if (!pointId) {
      console.error('Point ID is required');
      return NextResponse.json(
        { error: 'ID точки обязателен' },
        { status: 400 }
      );
    }

    const point = await prisma.point.findUnique({
      where: { id: pointId },
    });

    console.log('Found point:', point);

    if (!point) {
      return NextResponse.json(
        { error: 'Точка не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json(point);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}