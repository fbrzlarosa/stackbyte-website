import { getStatus, setStatus } from '@/lib/statusStore';
import { NextResponse } from 'next/server';

export async function GET() {
    const status = getStatus();
    return NextResponse.json(status);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { status, secret } = body;

        // Simple security check
        if (secret !== process.env.STATUS_API_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!['online', 'offline', 'holidays'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const newStatus = setStatus(status);
        return NextResponse.json(newStatus);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

