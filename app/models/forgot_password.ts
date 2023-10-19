import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export const forgotPasswordModel = prisma.forgot_password;