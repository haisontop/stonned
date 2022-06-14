import React from 'react'
import Head from 'next/head'

export default function StonedHead() {
  return (
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <link rel='shortcut icon' href='/images/logo1.png' />
      <title>Stoned Ape Crew | Cannabis NFT on SOL</title>
      <meta
        property='og:title'
        content='Stoned Ape Crew | Cannabis NFT on SOL'
        key='title'
      />
      <meta
        property='twitter:title'
        content=' Stoned Ape Crew | Cannabis NFTs on SOL'
      />
      <meta
        name='description'
        content='Everybody is vibing in Puff Valley, home to 4,142 Stoned Apes Conquering the Cannabis Industry as the #1 herb-related NFT project. A community of troublemakers, rebels, punks & the most chill people on the internet'
      />
      <meta
        property='og:description'
        content='Everybody is vibing in Puff Valley, home to 4,142 Stoned Apes Conquering the Cannabis Industry as the #1 herb-related NFT project. A community of troublemakers, rebels, punks & the most chill people on the internet'
      />
      <meta
        property='twitter:description'
        content='Everybody is vibing in Puff Valley, home to 4,142 Stoned Apes Conquering the Cannabis Industry as the #1 herb-related NFT project. A community of troublemakers, rebels, punks & the most chill people on the internet'
      />
      <meta property='og:image' content='/image/meta-image.jpg' />
      <meta property='twitter:image' content='/image/meta-image.jpg' />
      
      <meta property='twitter:card' content='summary_large_image' />
      <meta name="twitter:domain" content="stonedapecrew.com" />
    </Head>
  )
}
