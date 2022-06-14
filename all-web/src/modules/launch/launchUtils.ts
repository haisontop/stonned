import {
  MintTransaction,
  PaymentOption,
  Pricing,
  PrismaClient,
} from '@prisma/client'
import { isAfter, isBefore, subMinutes, subSeconds } from 'date-fns'
import { connection } from '../../config/config'
import prisma from '../../lib/prisma'
import rpc from '../../utils/rpc'

const validTransactionCondition = {
  OR: [
    { confirmed: true },
    { confirmed: false, createdAt: { gt: subSeconds(new Date(), 90) } },
  ],
}

export async function getLaunchReadyProject(
  projectId: string,
  prisma: PrismaClient,
  mintPeriodId: string
) {
  const loadedProject = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      mintingPeriods: {
        include: {
          pricings: true,
        },
      },
    },
  })
  let project = { ...loadedProject }
  if (!project) throw Error('project not found')
  if (!project.candyMachineId) throw Error('project is not ready for launch')

  if (!project.identifier)
    throw Error('project is not ready for launch. identifier must be set')

  const now = new Date()
  const currentLaunchPeriod = project.mintingPeriods?.find(
    (w) =>
      isAfter(now, w.startAt) && isBefore(now, w.endAt) && w.id == mintPeriodId
  )

  if (!currentLaunchPeriod) throw new Error('project is not ready to mint')

  const finalProject = { ...project, currentLaunchPeriod }

  return finalProject
}

export async function hasUserWhitelist(user: string, mintingPeriodId: string) {
  console.log('user', user, mintingPeriodId)

  const alreadyMinted = await checkAndGetPastTransactions(user, mintingPeriodId)
  const whiteListplace = await prisma.whitelistSpot.findUnique({
    where: {
      mintingPeriodId_userId: {
        userId: user,
        mintingPeriodId: mintingPeriodId,
      },
    },
  })
  if (!whiteListplace) throw new Error('Not whitelisted')

  if (alreadyMinted.length >= whiteListplace.amount)
    throw new Error('No whitelist spot left')

  return whiteListplace
}

export async function isMintingAllowed({
  wallet,
  project,
  payment,
  prisma,
  userId,
}: {
  userId: string
  wallet: string
  project: Awaited<ReturnType<typeof getLaunchReadyProject>>
  payment: PaymentOption
  prisma: PrismaClient
}) {
  const { currentLaunchPeriod } = project
  const alreadyMinted = await checkAndGetPastTransactions(
    userId,
    project.currentLaunchPeriod.id
  )

  if (currentLaunchPeriod.isWhitelist) {
    const whiteListplace = await prisma.whitelistSpot.findUnique({
      where: {
        mintingPeriodId_userId: {
          userId: userId,
          mintingPeriodId: project.currentLaunchPeriod.id,
        },
      },
    })
    if (!whiteListplace) throw new Error('No Whitelist spot found')

    console.log('alreadyMinted.length ', alreadyMinted.length)
    console.log('whiteListplace.amount', whiteListplace.amount)

    if (alreadyMinted.length >= whiteListplace.amount)
      throw new Error('you have no whitelist spot left')

    /* if (whiteListplace.hasMinted >= whiteListplace.amount)
      throw new Error('you have no whitelist spot left') */

    return whiteListplace
  }

  if (currentLaunchPeriod.maxPerWallet) {
    const mints = await prisma.mintTransaction.findMany({
      where: {
        mintPeriodId: currentLaunchPeriod.id,
        userId: userId,
        ...validTransactionCondition,
      },
    })
    if (mints.length >= currentLaunchPeriod.maxPerWallet)
      throw new Error(
        `Only ${currentLaunchPeriod.maxPerWallet} per wallet allowed`
      )
  }

  if (project.availablePercentageInSpl) {
    const mints = await prisma.mintTransaction.findMany({
      where: {
        mintPeriod: { projectId: project.id },
        paymentOption: {
          pricings: {
            some: {
              isSol: false,
            },
          },
        },
        ...validTransactionCondition,
      },
    })
    const already = (mints.length / (project.totalSupply ?? 0)) * 100
    console.log('already in spl', already)

    if (already >= project.availablePercentageInSpl)
      throw new Error('No more mints in SPL tokens available')
  }
  if (currentLaunchPeriod.supplyAvailable) {
    const alreadyMinted = await prisma.mintTransaction.findMany({
      where: {
        mintPeriodId: currentLaunchPeriod.id,
        ...validTransactionCondition,
      },
    })

    if (alreadyMinted.length > currentLaunchPeriod.supplyAvailable) {
      throw new Error('no mints allowed anymore in this minting period')
    }
  }

  return null
}

export async function checkAndGetPastTransactions(
  user: string,
  mintingPeriodId: string
) {
  const alreadyMinted = await prisma.mintTransaction.findMany({
    where: {
      userId: user,
      mintPeriodId: mintingPeriodId,
      ...validTransactionCondition,
    },
  })

  return alreadyMinted
}
