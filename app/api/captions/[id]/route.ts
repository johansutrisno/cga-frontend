import { NextResponse } from 'next/server'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'


export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserByClerkID()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const caption = await prisma.caption.findUnique({
            where: {
                id: params.id,
                userId: user.id
            }
        })

        if (!caption) {
            return NextResponse.json(
                { error: 'Caption not found or unauthorized' },
                { status: 404 }
            )
        }

        await prisma.caption.delete({
            where: {
                id: params.id
            }
        })

        return NextResponse.json({ message: 'Caption deleted successfully' })
    } catch (error) {
        console.error('Error deleting caption:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}