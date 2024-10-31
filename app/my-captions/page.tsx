import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getMyCaptions = async () => {
    const user = await getUserByClerkID()
    const captions = await prisma.caption.findMany({
        where: {
            userId: user?.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return captions
}

const MyCaptionsPage = async () => {
    const captions = await getMyCaptions()
    console.log('captions ', captions)

    return (<div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Coming Soon</h1>
            <p className="text-gray-500 text-lg">
                We&apos;re working hard to bring you something amazing!
            </p>
        </div>
    </div>)
}

export default MyCaptionsPage