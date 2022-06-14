import { GetServerSidePropsContext } from 'next'
import prisma from '../../lib/prisma'
import { verifySignature } from '../../utils/middlewareUtils'
import { pub } from '../../utils/solUtils'
import { getNftsFromOwnerByCreators } from '../../utils/splUtils'
import cicadaConfig, { signingMessage } from './cicadaConfig'

const images = [
  'https://ipfs.io/ipfs/QmYatageNLcwND2B3iBRdsCMwB4n5dARm5de8q3U1Qza4v?ext=png',
  'https://ipfs.io/ipfs/QmXYAoGoCEoMvjYUBFPZ56pJ8CRUx4QyPoSkTaZWY2sF7W?ext=jpg',
]

export async function isUserAllowedPageAndUpdate(
  wallet: string,
  step: number,
  shouldUpdate?: boolean
) {
  const nfts = await getNftsFromOwnerByCreators({
    owner: pub(wallet),
    withAmount: true,
    creators: [cicadaConfig.creator],
  })

  if (!nfts || nfts.length < 1) return false

  console.log('nfts', nfts)

  console.log(
    'nfts.attributes',
    nfts.map((n) => n.nft.attributes)
  )

  const nft = nfts[0]

  const nftStepTrait = nft.nft.attributes.find((a) => a.trait_type === 'Step')
  if (!nftStepTrait) throw new Error('No step attribute')
  const nftStep = Number(nftStepTrait.value)

  console.log('nftStep', nftStep)

  if (step > nftStep + 1) return false

  if (nftStep < step && shouldUpdate) {
    const metadataEntry = await prisma.tokenMetadata.findUnique({
      where: {
        mint: nft.nft.pubkey.toBase58(),
      },
    })
    if (!metadataEntry) throw new Error('Metadata not found')

    const metadata = JSON.parse(metadataEntry?.data)
    const stepTrait = metadata.attributes.find(
      (a: any) => a.trait_type === 'Step'
    )
    stepTrait.value = step

    let newImage: string | undefined
    if (step === 1) newImage = images[0]

    if (step === 5) {
      newImage = images[1]
      metadata.attributes.push({
        trait_type: 'Key',
        value:
          'https://discord.gg/4Wz74NBx' /* 'https://discord.gg/wnY8yTCQ7h' */,
      })
    }

    if (newImage) {
      metadata.image = newImage
      metadata.properties.files[0].uri = newImage
    }

    await prisma.tokenMetadata.update({
      where: {
        mint: nft.nft.pubkey.toBase58(),
      },
      data: {
        data: JSON.stringify(metadata),
      },
    })
  }

  return true
}

export function getCicadaAuthServerSideProps(
  step: number,
  shouldUpdate?: boolean
) {
  return async (
    context: GetServerSidePropsContext
  ): Promise<{
    props: { state: 'needs-auth' | 'not-allowed' | 'allowed' }
  }> => {
    const cicadaUserCookie = context.req.cookies.cicadaUser

    try {
      if (!cicadaUserCookie)
        return {
          props: {
            state: 'needs-auth',
          },
        }

      const user = JSON.parse(cicadaUserCookie)

      if (!verifySignature(user.wallet, user.signature, signingMessage))
        return {
          props: {
            state: 'needs-auth',
          },
        }

      if (!(await isUserAllowedPageAndUpdate(user.wallet, step, shouldUpdate)))
        return {
          props: {
            state: 'not-allowed',
          },
        }

      return {
        props: {
          state: 'allowed',
        },
      }
    } catch (e) {
      console.error('error in getCicadaAuthServerSideProps', e)

      return {
        props: {
          state: 'needs-auth',
        },
      }
    }
  }
}
