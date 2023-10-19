import { PrismaClient } from '@prisma/client'
import { PERMISSION } from './permission'
import { ROLE_HR } from './role'

const prisma = new PrismaClient()

export const root_permission = Object.values(PERMISSION).map( permission => permission)

export const admin_permission = [
    PERMISSION.ADD_USER,
    PERMISSION.READ_USER,
    PERMISSION.EDIT_USER,
    PERMISSION.BLOCK_USER,
    PERMISSION.READ_SESSION,
    PERMISSION.LOGOUT_SESSION,
]

export const user_permission = [
    PERMISSION.READ_USER,
    PERMISSION.EDIT_USER,
]

export const intern_permission = [
    PERMISSION.READ_USER
]

export const right_permission = (role : ROLE_HR) : PERMISSION[] => {
    switch (role){
        case ROLE_HR.ROOT:
            return root_permission
        case ROLE_HR.ADMIN:
            return admin_permission
        case ROLE_HR.USER:
            return user_permission
        case ROLE_HR.INTERN:
            return intern_permission
        default:
            throw new Error("Incorrect role asking")
    }
}

export const UserPermissionModel = prisma.user_permission;