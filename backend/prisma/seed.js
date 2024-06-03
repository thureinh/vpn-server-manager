const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const userData = [
  {
    name: 'thurein',
    email: 'thurein@gmail.com',
    password: 'root',
    role: 'admin',
    description: 'admin account'
  }
]

async function main() {
  console.log(`Start seeding ...`)
  const saltRounds = parseInt(process.env.SALT_ROUNDS || 10)
  for (const u of userData) {
    try {
      u.password = bcrypt.hashSync(u.password, saltRounds)
    } catch (error) {
      console.log(`Password cannot be encrypted`)
    }
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })