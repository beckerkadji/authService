import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export enum USER_ROLE {
    ROOT = 1,
    ADMIN = 2,
    USER= 3
}

export enum ROLE_HR {
    ROOT = "root",
    ADMIN = "admin",
    USER = "user",
    INTERN = "intern"
}

export const roleModel = prisma.role;