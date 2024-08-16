import { singleton } from '@/utils/singleton.server'
import { PrismaClient } from '@prisma/client'

const prisma = singleton('prisma', () => new PrismaClient())
prisma.$connect()

export { prisma }