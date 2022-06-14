import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { solanaAuthConfig } from '../../../modules/common/authConfig'
import { verifySignature } from '../../../utils/middlewareUtils'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  if (
    req.method === 'POST' ||
    url.pathname.startsWith('/api/trpc/launch.getUser')
  ) {
    const signature = req.headers.get('signature')
    const wallet = req.headers.get('wallet')

    const signatureArray = Array.from(JSON.parse(signature!).signature) as any

    if (
      !signature ||
      !wallet ||
      !verifySignature(wallet, signatureArray, solanaAuthConfig.signingMessage)
    )
      return new Response('Auth Required', {
        status: 401,
      })

    console.log('successful auth', wallet)
  }
}
