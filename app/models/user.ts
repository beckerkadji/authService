import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export enum AUTHUSER {
    "ROOT" = "root",
    "ADMIN" = "admin",
    "USER" = "user"
}

export const UserModel = prisma.user