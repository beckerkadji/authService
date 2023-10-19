import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export enum PERMISSION {
    // User Management
    READ_USER = "read_user",
    ADD_USER = "add_user",
    EDIT_USER = "edit_user",
    DELETE_USER = "delete_user",
    BLOCK_USER = "block_user",
    INVITE_USER = "invite_user",

    // Permission Management
    ADD_PERMISSION = "add_permission",
    REMOVE_PERMISSION = "remove_permission",

    // Role Management
    CHANGE_ROLE = "change_role",

    // Session Management
    READ_SESSION = "read_session",
    LOGOUT_SESSION = "logout_session",

    // Manage Target
    ADD_TARGET = "add_target",
    EDIT_TARGET = "edit_target",
    REMOVE_TARGET = "remove_target",

    // Manage Supplement search information
    ADD_SUP_SEARCH = "add_sup_search"
}

export const permitionModel = prisma.permission;