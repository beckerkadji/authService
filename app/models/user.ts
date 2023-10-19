import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const SALT_ROUND = 10;

export enum AUTHUSER {
    "ROOT" = "root",
    "ADMIN" = "admin",
    "USER" = "user"
}

export const UserModel = prisma.user