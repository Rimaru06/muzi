import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { spaces: true },
        });

        if (user && user.spaces.length > 0) {
            return NextResponse.json({ hasSpace: true }, { status: 200 });
        } else {
            return NextResponse.json({ hasSpace: false }, { status: 200 });
        }
    } catch (error) {
        console.error('Error checking user space:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}