import { PrismaClient, Prisma } from '@prisma/client'
import {roleModel, USER_ROLE} from "../app/models/role";
import {AUTHUSER, UserModel} from "../app/models/user";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient()
import dotenv from "dotenv";
import { permitionModel } from '../app/models/permission';
import { UserPermissionModel, root_permission } from '../app/models/user_permission';
dotenv.config()

//Role data for seeding
const role_data: Prisma.RoleCreateInput[] = Object.keys(USER_ROLE)
    .filter(x => !(parseInt(x) >= 0))
    .map(name => ({name}))

async function main() {

    console.log("Start seeding ...")

    for(const u of role_data){
        console.log("Role seeding...")
        const role = await roleModel.create({data: u})
        console.log(`Role created with id ${role.id}`)
    }

    console.log(`Start User seeding ...`)
    const user = await UserModel.create({
        data : {
            firstName : "admin",
            lastName : "root",
            email: "kadjibecker@gmail.com",
            phone: "+237696809088",
            verified_at : new Date(),
            password : bcrypt.hashSync('password',10),
            role : {connect : {id : USER_ROLE.ROOT}},
        }
    })
    console.log(`Created user with id: ${user.id}`)

    console.log(`Start Permission seeding ...`)
    await permitionModel.createMany({data : root_permission.map(itm => ({name : itm}))})
    console.log(`Permission seeded with success!`)
  
    console.log(`Start User Permission seeding ...`)
    await UserPermissionModel.createMany({data : root_permission.map(itm => ({permission_id : itm, user_id : user.id}))})
    console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })