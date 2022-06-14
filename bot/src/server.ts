import { client } from './client'
import express from 'express'
import { differenceInMinutes } from 'date-fns'
import config, { connection } from './config'
import axios from 'axios'
import { verify } from 'hcaptcha'
require('express-async-errors')
const cors = require('cors')
var bodyParser = require('body-parser')
import { prisma } from './prisma'
import { verifySignature, transfer } from './utils/solUtils'
import { prismaClient, wallet } from './config'
import { z } from 'zod'
import * as spl from '@solana/spl-token'

export const app = express()
app.use(cors())
app.use(bodyParser.json())
const sleep = () =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 350)
  })

app.post('/verifyAddress', async (req, res) => {
  try {
    const body =
      req.body ??
      ({} as {
        requestId: string
        address: string
        signature: number[]
      })

    const verifyRequest = await prisma.verifyRequest.findUnique({
      where: {
        id: body.requestId,
      },
      include: { user: true },
    })

    if (!verifyRequest) throw new Error('verify request not found')

    if (differenceInMinutes(new Date(), verifyRequest.createdAt) > 30)
      throw new Error('verify request is expired')

    if (!verifySignature(body.address, body.signature))
      throw new Error('signature couldnt be verified')

    const guild = await client.guilds.fetch(verifyRequest.guildId)
    if (!guild) throw new Error('no guild')

    const roleName = 'sol-verified'

    let role = await guild.roles.cache.find((c) => c.name == roleName)

    if (!role) {
      console.log(`should create new role sol-verified`, role)

      role = await guild.roles.create({
        name: roleName,
        color: '#00ffa3',
      })
    }

    const member = await guild.members.fetch(verifyRequest.user.discordId)
    await member.roles.add(role)

    await prisma.user.update({
      where: {
        id: verifyRequest.userId,
      },
      data: {
        address: body.address,
      },
    })

    const user = await client.users.fetch(verifyRequest.user.discordId)

    res.json({})
  } catch (e) {
    res.status(500).json({ message: 'unexpected error' })
    console.error('error in http /verifysol', e)
  }
})

const VerifyRequestBody = z.object({
  requestId: z.string(),
  address: z.string(),
  transId: z.string(),
})

app.post('/verifyLedger', async (req, res) => {
  try {
    const bodyParseRes = VerifyRequestBody.safeParse(req.body)

    if (!bodyParseRes.success) {
      throw bodyParseRes.error
    }

    const body = bodyParseRes.data

    const verifyRequest = await prisma.verifyRequest.findUnique({
      where: {
        id: body.requestId,
      },
      include: { user: true },
    })

    if (!verifyRequest) throw new Error('verify request not found')

    if (!verifyRequest.ledgerVerifyAmount)
      throw new Error('ledgerVerifyAmount missing')

    if (differenceInMinutes(new Date(), verifyRequest.createdAt) > 30)
      return res.status(422).json({
        message: 'verifyRequest is expired, got back to discord and make a new',
      })

    console.log('transId', body.transId)

    await connection.confirmTransaction(body.transId, 'recent')

    const transaction = await connection.getParsedConfirmedTransaction(
      body.transId
    )

    if (!transaction)
      return res.status(422).json({
        message: 'transaction not found',
      })

    const lamportTransactionAmount = (
      transaction.transaction.message.instructions[0] as any
    )?.parsed?.info?.lamports as number

    console.log('lamportTransactionAmount', lamportTransactionAmount)

    if (lamportTransactionAmount !== verifyRequest.ledgerVerifyAmount)
      return res.status(422).json({
        message: 'transactionAmount is wrong',
      })

    const guild = await client.guilds.fetch(verifyRequest.guildId)
    if (!guild) throw new Error('no guild')

    const roleName = 'sol-verified'

    let role = await guild.roles.cache.find((c) => c.name == roleName)

    if (!role) {
      console.log(`should create new role sol-verified`, role)

      role = await guild.roles.create({
        name: roleName,
        color: '#00ffa3',
      })
    }

    const member = await guild.members.fetch(verifyRequest.user.discordId)
    await member.roles.add(role)

    await prisma.user.update({
      where: {
        id: verifyRequest.userId,
      },
      data: {
        address: body.address,
      },
    })

    const user = await client.users.fetch(verifyRequest.user.discordId)

    res.json({})
  } catch (e) {
    console.error('error in http /verifysol', e)
    throw e
  }
})

app.get('/mintAccess', async (req, res) => {
  const query = req.query
  if (typeof query.mintAccessId !== 'string') {
    res.status(404).json({ error: 'No mint access id provided' })
    return
  }

  if (Array.isArray(query.mintAccessId)) {
    res.status(404).json({ error: 'Mint access needs to be string' })
    return
  }

  const mintAccess = await prisma.mintAccess.findUnique({
    where: { id: query.mintAccessId },
  })

  if (!mintAccess) {
    res.status(404).json({ error: 'Mint access id not found' })
    return
  }

  const user = await prisma.user.findUnique({
    where: {
      id: mintAccess.userId,
    },
  })

  res
    .status(200)
    .json({ mintAccessId: mintAccess.id, discordId: user?.discordId })
})

/* app.get('/verifyRequest', async (req, res) => {
  try {
    const requestId = req.query.id

    if (typeof requestId != 'string')
      return res.status(422).send('requestId not provided')

    const verifyRequest = await prisma.verifyRequest.findUnique({
      where: {
        id: requestId,
      },
      include: { user: true },
    })

    if (!verifyRequest) throw new Error('verify request not found')

    res.json(verifyRequest)
  } catch (e) {
    console.error('error in http /verifyRequest', e)
  }
}) */

app.post('/airdrop', async (req, res) => {
  const body = req.body as {
    dest: string
    mintAccessId: string
    captcha: string
  }

  console.log('body.dest', body.dest)
  const { captcha, mintAccessId, dest } = body

  if (!mintAccessId || !dest) {
    return res.status(422).json({
      message: 'Unproccesable request, please provide the required fields',
    })
  }

  try {
    const mintAccess = await prismaClient.mintAccess.findUnique({
      where: { id: body.mintAccessId },
    })

    if (!mintAccess) {
      return res
        .status(404)
        .json({ error: 'No mint access with this id found' })
    }

    if (mintAccess.hasBeenUsed) {
      return res.status(422).json({ error: 'already got item airdroped' })
    }

    const trans = await transfer(mintAccess.mintId, wallet, body.dest, 1)

    if (!!trans) {
      await prismaClient.mintAccess.update({
        data: { hasBeenUsed: true },
        where: { id: mintAccess.id },
      })
    }

    return res.status(200).json(trans)
  } catch (error) {
    console.log('logging out')
    console.log(error)
    return res.status(422).json({ message: 'Something went wrong' })
  }
})

app.post('/registerCaptcha', async (req, res) => {
  const { body, method } = req

  // Extract the email and captcha code from the request body
  const { email, captcha } = body

  if (method === 'POST') {
    // If email or captcha are missing return an error
    if (!email || !captcha) {
      return res.status(422).json({
        message: 'Unproccesable request, please provide the required fields',
      })
    }

    try {
      // Ping the google recaptcha verify API to verify the captcha code you received
      const response = await axios.post(`https://hcaptcha.com/siteverify`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: `response=${captcha}&secret=${process.env.HCAPTCHA_SECRET_KEY}`,
        method: 'POST',
      })
      const captchaValidation = await response.data
      /**
       * The structure of response from the veirfy API is
       * {
       *  "success": true|false,
       *  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
       *  "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
       *  "error-codes": [...]        // optional
        }
       */
      if (captchaValidation.success) {
        // Replace this with the API that will save the data received
        // to your backend
        await sleep()
        // Return 200 if everything is successful
        return res.status(200).send('OK')
      }

      return res.status(422).json({
        message: 'Unproccesable request, Invalid captcha code',
      })
    } catch (error) {
      console.log(error)
      return res.status(422).json({ message: 'Something went wrong' })
    }
  }
  // Return 404 if someone pings the API with a method other than
  // POST
  return res.status(404).send('Not found')
})
