import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
   req: Request,
   context: { params: { id: string } }
) {

    try {
        
        const spotId = context.params.id;
        
        const region = await prisma.region.deleteMany({
            where: { id: spotId },
        });

        await prisma.areaCoordinate.deleteMany({
            where: { areaId: spotId },
        });

        return NextResponse.json({ message: 'Region deleted successfully' }, { status: 200 });
        
    } catch (error) {
        console.error('Error deleting region:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}