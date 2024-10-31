import { currentUser } from '@clerk/nextjs/server'
import { prisma } from "./db";

export const getUserByClerkID = async () => {
    const user = await currentUser()

    const userDB = await prisma.user.findUniqueOrThrow({
        where: {
            clerkId: user?.id
        },
    })

    return userDB
}