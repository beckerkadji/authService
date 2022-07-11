import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export enum USER_ROLE {
    ROOT = 1,
    ADMIN = 2,
    USER= 3
}

export const RoleModel = prisma.role;