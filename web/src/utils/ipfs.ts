import log from 'loglevel'
import fetch from 'node-fetch'
import { create, globSource } from 'ipfs-http-client'
import path from 'path'
import { sleep } from './utils'
import { existsSync } from 'fs'

const ipfsCredentials = {
  projectId: process.env.IPFS_PROJECT_ID as string,
  secretKey: process.env.IPFS_SECRET_KEY as string,
}

export async function ipfsUploadOneFile(args: IpfsUpload) {
  const filePath = 'filePath' in args ? args.filePath : null
  const file = 'file' in args ? args.file : null

  const tokenIfps = `${ipfsCredentials.projectId}:${ipfsCredentials.secretKey}`
  // @ts-ignore
  const ipfs = create('https://ipfs.infura.io:5001')

  const uploadToIpfs = async (source: any) => {
    const { cid } = await ipfs.add(source).catch()
    return cid
  }
  const ext =
    args.ext ?? (filePath ? path.extname(filePath).replace('.', '') : null)

  if (filePath && !existsSync(filePath))
    throw new Error('couldnt find file at ' + filePath)

  const mediaHash = await uploadToIpfs(
    filePath ? globSource(filePath, { recursive: true } as any) : file
  )

  log.debug('mediaHash:', mediaHash)
  const mediaUrl = `https://ipfs.io/ipfs/${mediaHash}${
    ext ? `?ext=${ext}` : ''
  }`
  log.debug('mediaUrl:', mediaUrl)
  const authIFPS = Buffer.from(tokenIfps).toString('base64')
  await fetch(`https://ipfs.infura.io:5001/api/v0/pin/add?arg=${mediaHash}`, {
    headers: {
      Authorization: `Basic ${authIFPS}`,
    },
    method: 'POST',
  })
  log.info('uploaded image for file:', filePath)

  await sleep(500)

  return mediaUrl
}

export interface ipfsCreds {
  projectId: string
  secretKey: string
}

type IpfsUpload = { ext?: string } & (
  | {
      filePath: string
    }
  | {
      file: Buffer
    }
)

export async function ipfsUpload(
  ipfsCredentials: ipfsCreds,
  image: string,
  manifestBuffer: Buffer
) {
  const tokenIfps = `${ipfsCredentials.projectId}:${ipfsCredentials.secretKey}`
  // @ts-ignore
  const ipfs = create('https://ipfs.infura.io:5001')

  const uploadToIpfs = async (source: any) => {
    const { cid } = await ipfs.add(source).catch()
    return cid
  }
  console.log('🚀 ~ file: ipfs.ts ~ line 29 ~ image', image)
  const ext = image.split('.')[1]

  const mediaHash = await uploadToIpfs(
    globSource(image, { recursive: true } as any)
  )
  log.debug('mediaHash:', mediaHash)
  const mediaUrl = `https://ipfs.io/ipfs/${mediaHash}?ext=${ext}`
  log.debug('mediaUrl:', mediaUrl)
  const authIFPS = Buffer.from(tokenIfps).toString('base64')
  await fetch(`https://ipfs.infura.io:5001/api/v0/pin/add?arg=${mediaHash}`, {
    headers: {
      Authorization: `Basic ${authIFPS}`,
    },
    method: 'POST',
  })
  log.info('uploaded image for file:', image)

  await sleep(500)

  const manifestJson = JSON.parse(manifestBuffer.toString('utf8'))
  manifestJson.image = mediaUrl
  manifestJson.properties.files = manifestJson.properties.files.map(
    (f: any) => {
      return { ...f, uri: mediaUrl }
    }
  )

  const manifestHash = await uploadToIpfs(
    Buffer.from(JSON.stringify(manifestJson))
  )
  await fetch(
    `https://ipfs.infura.io:5001/api/v0/pin/add?arg=${manifestHash}`,
    {
      headers: {
        Authorization: `Basic ${authIFPS}`,
      },
      method: 'POST',
    }
  )

  await sleep(500)
  const link = `https://ipfs.io/ipfs/${manifestHash}`
  log.info('uploaded manifest: ', link)

  return [link, mediaUrl]
}
