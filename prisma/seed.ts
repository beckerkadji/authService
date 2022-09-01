import { PrismaClient, Prisma } from '@prisma/client'
import {RoleModel, USER_ROLE} from "../app/models/role";
import {AUTHUSER, UserModel} from "../app/models/user";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient()
import dotenv from "dotenv";
dotenv.config()

//Role data for seeding
const userRole : Prisma.RoleCreateManyInput[] = [
    {
        id: USER_ROLE.ROOT,
        name : AUTHUSER.ROOT,
        level: 100,
    },
    {
        id: USER_ROLE.ADMIN,
        name : AUTHUSER.ADMIN,
        level: 70,
    },
    {
        id: USER_ROLE.USER,
        name : AUTHUSER.USER,
        level: 40,
    },
]

async function main() {

    console.log("Start seeding ...")

    for(const u of userRole){
        console.log("Role seeding...")
        const role = await RoleModel.create({data: u})
        console.log(`Role created with id ${role.id}`)
    }

  const user = await UserModel.create({
      data : {
          firstName : "becker",
          lastName : "kadji",
          email: "kadjibecker@gmail.com",
          roleId: USER_ROLE.ROOT,
          password : bcrypt.hashSync('password',10)
      }
  })
    console.log(user)

   console.log("Seeding finish...")
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })