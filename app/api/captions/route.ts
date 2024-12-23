import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server';
import { CreateCaptionResponse, CreateCaptionRequest } from '@/types/caption';

export async function GET() {
    try {
        const user = await getUserByClerkID()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const captions = await prisma.caption.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ data: captions })
    } catch (error) {
        console.error('Error fetching captions:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(
    req: Request
): Promise<NextResponse<CreateCaptionResponse | { error: string }>> {
    try {
        const user = await getUserByClerkID()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body: CreateCaptionRequest = await req.json();

        if (!isValidCaptionRequest(body)) {
            return NextResponse.json(
                { error: 'Invalid request body' } as { error: string },
                { status: 400 }
            );
        }

        const { content, hashtags } = body;

        const savedCaption = await prisma.caption.create({
            data: {
                user: {
                    connect: {
                        id: user.id
                    }
                },
                content: content,
                hashtags: hashtags,
            }
        });

        const response: CreateCaptionResponse = {
            message: 'Caption saved successfully',
            data: savedCaption
        };

        return NextResponse.json(response, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' } as { error: string },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

function isValidCaptionRequest(body: any): body is CreateCaptionRequest {
    return (
        typeof body === 'object' &&
        typeof body.content === 'string' &&
        body.content.length > 0 &&
        typeof body.hashtags === 'string'
    );
}