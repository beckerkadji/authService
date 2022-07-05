import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here

//   const user = await prisma.user.create({
//       data : {
//           firstName : "becker",
//           lastName : "kadji",
//           email: "kadjibecker@gmail.com"
//       }
//   })

//   console.log(user)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })