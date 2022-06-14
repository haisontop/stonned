import { PrismaClient } from '@prisma/client'
import { Command } from 'commander'
import { addDays } from 'date-fns'
import config from '../src/config/config'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

const program = new Command()
program.version('0.0.1')

program.command('addPaymentOptions').action(async (e) => {
  const projectIdendifier = 'PlaneX'

  const periods = [
   /*  {
      name: 'Whitelist',
      priceInSol: 0.5,
      tokens: [
        {
          symbol: 'SOL',
        },
        {
          symbol: 'PUFF',
          token: config.puffToken,
        },
        {
          symbol: 'ALL',
          token: config.allToken,
        },
      ],
    },
    {
      name: 'Public Sale',
      priceInSol: 1,
      tokens: [
        {
          symbol: 'SOL',
        },
        {
          symbol: 'PUFF',
          token: config.puffToken,
        },
        {
          symbol: 'ALL',
          token: config.allToken,
        },
      ],
    }, */
    {
      name: 'Public Sale 2.0',
      priceInSol: 0.042,
      tokens: [
        {
          symbol: 'SOL',
        },
       /*  {
          symbol: 'PUFF',
          token: config.puffToken,
        },
        {
          symbol: 'ALL',
          token: config.allToken,
        }, */
      ],
    },
  ]

  for (let periodConfig of periods) {
    const mintingPeriod = await prisma.mintingPeriod.findFirst({
      where: {
        project: { identifier: projectIdendifier },
        periodName: periodConfig.name,
      },
      rejectOnNotFound: true,
    })

    for (let t of periodConfig.tokens) {
      await prisma.paymentOption.create({
        data: {
          mintingPeriodId: mintingPeriod.id,
          pricings: {
            create: {
              isSol: !(t as any).token,
              amountInSol: periodConfig.priceInSol,
              currency: t.symbol,
              token: (t as any).token,
              whitelistPeriodId: mintingPeriod.id,
            },
          },
        },
      })
    }
  }
})

program.command('createLaunchpadMockdata').action(async (e) => {
  try {
    // console.log(`creating bestbuds data`)

    // const bestBudsProject = await createBestBudsData()

    // console.log('created bestbuds data')

    // await prisma.featuredProjectSpot.create({
    //   data: {
    //     projectId: bestBudsProject.id,
    //     startAt: new Date(),
    //     endAt: new Date(),
    //     isActive: true,
    //   },
    // })

    // console.log('created bestbuds featured')

    // const bongHeadsProject = await createBongHeadsData()

    // console.log('created bongheads data')

    // await prisma.featuredProjectSpot.create({
    //   data: {
    //     projectId: bongHeadsProject.id,
    //     startAt: new Date(),
    //     endAt: new Date(),
    //     isActive: false,
    //   },
    // })

    // console.log('created bongheads featured')

    // console.log('create stoneheads data')

    // const stoneheadsProject = await createStoneheadsData()

    // await prisma.featuredProjectSpot.create({
    //   data: {
    //     projectId: stoneheadsProject.id,
    //     startAt: new Date(),
    //     endAt: new Date(),
    //     isActive: true,
    //   },
    // })

    // console.log('created stoneheads featured')

    console.log('create plane-x data')

    const planeXProject = await createPlaneXData()

    await prisma.featuredProjectSpot.create({
      data: {
        projectId: planeXProject.id,
        startAt: new Date(),
        endAt: new Date(),
        isActive: true,
      },
    })

    console.log('created plane-x featured')

    console.log('creating data finished')
  } catch (err) {
    console.log('err', err)
  }
})

program.command('insertBanList').action(async () => {
  const validList = require('./Gh5S5bZkqmbEHxLvv2PW3rtfHa95WGUwLdvYG2VVPFGN_mint_accounts.json')
  const fullList = require('./hash_list_Gh5S5bZkqmbEHxLvv2PW3rtfHa95WGUwLdvYG2VVPFGN.json')

  const invalidList: { mintAddress: string }[] = []

  for (const mint of fullList) {
    if (!validList.includes(mint)) {
      invalidList.push({
        mintAddress: mint,
      })
    }
  }

  const created = await prisma.banlist.createMany({
    data: invalidList,
  })
  console.log('created ban list of', created.count)
})

async function createBongHeadsData() {
  const project = await prisma.project.create({
    data: {
      desktoBannerUrl: '/partners/bongheads/desktopBanner.png',
      mobileBannerUrl: '/partners/bongheads/mobileBanner.png',
      profilePictureUrl: '/partners/bongheads/bongheads-nft.png',
      projectDescription:
        'BongHeads is a Marijuana-related NFT that will be building casinos that pays holders a revenue share of the Casino house profits. BongHeads will be using 100% of the royalties to reinvest back into the project',
      projectName: 'BongHeads',
      identifier: 'BongHeads',
      projectUrlIdentifier: 'bongheads',
      creatorName: 'BongHeads',
      publicMintPrice: 1.5,
      publicMintStart: new Date('2022-03-20T21:00:00+00:00'),
      reservedPublicSupply: 0,
      totalSupply: 2420,
      isDoxxed: true,
      isVerified: true,
      candyMachineId: 'HpXTWi56WcVSLPZdo2FiXExQordc3XF4QsepkpiEShKU',
      projectReviews: {
        createMany: {
          data: [
            {
              review: '',
              score: 80,
              reviewer: 'RadRugs',
            },
            {
              review: 'VeriFi approved',
              score: 100,
              reviewer: 'Alpha Labs',
            },
          ],
        },
      },
      utilities: {
        createMany: {
          data: [
            {
              headline: 'HRHC Crash Casino & Minesweeper',
              description:
                'Casino games & Crash will be available shortly after mint. Crash will be hosted on HRHC casino. Hlders will be paid 40% house profits & 40% transaction fee profits. Minesweeper will be hosted independently',
            },
            {
              headline: 'Evolution / Deflation / Staking',
              description:
                'We will tie in evolution and a deflationary system. We probably want to half the supply and double the revenue & receive a gen 2 BongHead. Staking will arrive between now & the evolution.',
            },
            {
              headline: 'Merchandise & Online store',
              description:
                'We have partnered with a global manufacturer, supplier, and distributor to manufacture BongHeads Merch. The tier of merch you can receive will increase based on the NFTs you hold. All merch will have a thematic fit & is sold in our online store.',
            },
            {
              headline: 'Marijuana strain & tobacco blend',
              description:
                'BongHeads will be creating their own marijuana strain & tobacco blend. See more in roadmap.',
            },
          ],
        },
      },
      teamMembers: {
        createMany: {
          data: [
            {
              memberName: 'Asiago / Alex',
              description:
                'Founder / Artist. Experience in running multi-platform gaming organisations, major international companies, and has both a law and philosophy degree. Alexander started his business endeavours from a very young age. Asiago is the artist, as well as designing the business model & more',
              imageUrl: 'https://bongheads.io/images/team/Asiago-final.jpeg',
            },
            {
              memberName: 'DAGGA',
              description:
                'Discord Admin. She is responsible for anti-bot measures, verification tools, and any other requirements for running an NFT project out of discord',
              imageUrl: 'https://bongheads.io/images/team/Dagga-final.jpeg',
            },
            {
              memberName: 'Sigma',
              imageUrl: 'https://bongheads.io/images/team/laserskull.jpeg',
              description:
                'Web Dev. He holds a Masters degree in Computer Science and Maths & is the tech guy',
            },
          ],
        },
      },
      roadmapPeriods: {
        create: {
          periodName: 'Phase 1',
          roadmapItems: {
            createMany: {
              data: [
                {
                  headline: 'HRHC Crash Casino',
                  description:
                    'Casino game(s) & Crash will be available shortly after mint. Detailed explanations of security, marketing strategies and finance management is fully explained in our whitepaper and will be available in the DAO channels.',
                },
                {
                  headline: 'Bongsweeper',
                  description:
                    'Minesweeper will be hosted independently but built by SolaLand with holder benefits. Holders will be paid 70% of total house profits and 100% of transaction fees.',
                },
                {
                  headline: 'Evolution / Deflation / Staking',
                  description:
                    'We have a lot of ideas for coin utility that we can tie into the evolution, the Casinos, and the online store esp. a deflationary mechanism to increase rewards for holders.',
                },
              ],
            },
          },
        },
      },
    },
  })

  await prisma.projectRoadmapPeriod.create({
    data: {
      projectId: project.id,
      periodName: 'Phase 2',
      roadmapItems: {
        createMany: {
          data: [
            {
              headline: 'Merchandise',
              description:
                'On a baseline level in our tiered system, we would see holders receiving merch such as lighters and grinders. And as the tiers increase you can expect items such as hoodies, cups, bottle openers, fleeces, etc. ',
            },
            {
              headline: 'Online store',
              description:
                'We will open an online store and sell BongHeads manufactured Bongs, pipes, decals, and other marijuana-related products. We will follow a similar drop system to that of hype beast clothing brands. Limited sized collections.',
            },
          ],
        },
      },
    },
  })

  await prisma.projectRoadmapPeriod.create({
    data: {
      projectId: project.id,
      periodName: 'Phase 3',
      roadmapItems: {
        createMany: {
          data: [
            {
              headline: 'CBD strain',
              description:
                'BongHeads will be creating their own marijuana strain that will be sold in dispensaries initially starting in North America. BongHeads will also be making CBD products that will be sold globally. Everything with a including profit share for holders',
            },
            {
              headline: 'Tobacco blend',
              description:
                'BongHeads will be manufacturing and selling their own Tobacco blend globally. We will be setting up the fundamentals to enter this trillion-dollar annually earning industry.',
            },
          ],
        },
      },
    },
  })

  const publicMintingPeriod = await prisma.mintingPeriod.create({
    data: {
      projectId: project.id,
      startAt: new Date('2022-03-20T21:00:00+00:00'),
      endAt: new Date('2022-06-21T20:00:00+00:00'),
      price: 1.5,
      supplyAvailable: 2420,
      totalPriceInSol: 1.5,
      periodName: 'Public Sale',
      maxPerWallet: 5,
      isWhitelist: false,
    },
  })

  await prisma.paymentOption.create({
    data: {
      mintingPeriodId: publicMintingPeriod.id,
      pricings: {
        create: {
          isSol: true,
          amount: 1.5,
          currency: 'SOL',
          whitelistPeriodId: publicMintingPeriod.id,
        },
      },
    },
  })

  await prisma.paymentOption.create({
    data: {
      mintingPeriodId: publicMintingPeriod.id,
      pricings: {
        create: {
          isSol: false,
          amountInSol: 1.5,
          currency: 'PUFF',
          token: config.puffToken,
          whitelistPeriodId: publicMintingPeriod.id,
        },
      },
    },
  })

  await prisma.paymentOption.create({
    data: {
      mintingPeriodId: publicMintingPeriod.id,
      pricings: {
        create: {
          isSol: false,
          amountInSol: 1.5,
          currency: 'ALL',
          whitelistPeriodId: publicMintingPeriod.id,
          token: config.allToken,
        },
      },
    },
  })

  const whitelistMintingPeriod = await prisma.mintingPeriod.create({
    data: {
      projectId: project.id,
      startAt: new Date('2022-03-20T20:30:00+00:00'),
      endAt: new Date('2022-03-20T21:00:05+00:00'),
      price: 1,
      supplyAvailable: 2420,
      totalPriceInSol: 1,
      periodName: 'Presale Sale',
      maxPerWallet: 5,
      isWhitelist: true,
      description: 'People rewarded with spots are able to mint',
    },
  })

  await prisma.paymentOption.create({
    data: {
      mintingPeriodId: whitelistMintingPeriod.id,
      pricings: {
        create: {
          isSol: false,
          amountInSol: 1,
          currency: 'ALL',
          whitelistPeriodId: whitelistMintingPeriod.id,
          token: config.allToken,
        },
      },
    },
  })

  await prisma.paymentOption.create({
    data: {
      mintingPeriodId: whitelistMintingPeriod.id,
      pricings: {
        create: {
          isSol: false,
          amountInSol: 1,
          currency: 'PUFF',
          whitelistPeriodId: whitelistMintingPeriod.id,
          token: config.puffToken,
        },
      },
    },
  })

  await prisma.paymentOption.create({
    data: {
      mintingPeriodId: whitelistMintingPeriod.id,
      pricings: {
        create: {
          isSol: true,
          amount: 1,
          whitelistPeriodId: whitelistMintingPeriod.id,
          currency: 'SOL',
        },
      },
    },
  })

  return project
}

async function createBestBudsData() {
  const project = await prisma.project.create({
    data: {
      desktoBannerUrl:
        'https://dl.airtable.com/.attachmentThumbnails/7bcd028b274eda2f8d5098f40f2194aa/9431147c',
      mobileBannerUrl:
        'https://dl.airtable.com/.attachmentThumbnails/0178681be371e9cda23c4a03671af5f7/f0975370',
      profilePictureUrl:
        'https://dl.airtable.com/.attachmentThumbnails/179c5a9353cfa4d2f4dea8e0cc8b8bdb/2fbbe121',
      logoUrl:
        'https://dl.airtable.com/.attachmentThumbnails/4acc150b99507665d01be154971fa25d/205a7fbb',
      projectDescription:
        'Mary Janes are the female counterpart of Best Buds and will activate staking utility and breeding capabilities so that the community can passively grow their collection! MJ’s will also usher in a new fantastic looking IP and market base.',
      projectName: 'Mary Janes',
      identifier: 'MaryJanes',
      projectUrlIdentifier: 'mary_janes',
      creatorName: 'BestBuds',
      isIncubator: true,
      isDoxxed: true,
      isVerified: true,
      publicMintPrice: 4.2,
      publicMintStart: new Date('2022-03-20T19:00:00+00:00'),
      reservedPublicSupply: 0,
      totalSupply: 4200,
      candyMachineId: 'HpXTWi56WcVSLPZdo2FiXExQordc3XF4QsepkpiEShKU',
      utilities: {
        createMany: {
          data: [
            {
              headline: 'Live Events',
              description: 'Access to exclusive live events in the US',
            },
            {
              headline: 'Staking Utility',
              description: 'Holders will earn 8 $ALL coin per day',
            },
            {
              headline: 'Breeding Utility',
              description: 'You can breed 1 Mary Jane and 1 Best Bud',
            },
            {
              headline: 'Community',
              description: 'You can breed 1 Mary Jane and 1 Best Bud',
            },
            {
              headline: 'Products',
              description: 'Access to MaryJane Cannabis products',
            },
          ],
        },
      },
      teamMembers: {
        createMany: {
          data: [
            {
              memberName: 'Doc Hollywood',
              imageUrl:
                'https://pbs.twimg.com/profile_images/1500897900930338816/OA1ZH95I_400x400.jpg',
              twitterUrl: 'https://twitter.com/drhollywood',
            },
          ],
        },
      },
      roadmapPeriods: {
        create: {
          periodName: 'Phase 1',
          roadmapItems: {
            createMany: {
              data: [
                {
                  headline: 'Activate Staking',
                  description:
                    'Onboard MaryJanes into the staking mechanism of ALL BLUE',
                },
              ],
            },
          },
        },
      },
    },
  })

  await prisma.projectRoadmapPeriod.create({
    data: {
      projectId: project.id,
      periodName: 'Phase 2',
      roadmapItems: {
        createMany: {
          data: [
            {
              headline: 'MaryJane Events',
              description:
                'We will host several events on- and off-chain to promo Mary Jane.',
            },
            {
              headline: 'MaryJane Brand',
              description:
                'Marketing & cross promos specifically for MaryJanes',
            },
          ],
        },
      },
    },
  })

  await prisma.projectRoadmapPeriod.create({
    data: {
      projectId: project.id,
      periodName: 'Phase 3',
      roadmapItems: {
        createMany: {
          data: [
            {
              headline: 'MaryJane Products',
              description:
                'MaryJanes will come with their own line of products',
            },
            {
              headline: 'Breeding',
              description:
                'Breed 1 Best Buds & 1 Mary Jane to get a baby bud using $ALL',
            },
          ],
        },
      },
    },
  })

  const mintingPeriod = await prisma.mintingPeriod.create({
    data: {
      projectId: project.id,
      startAt: new Date('2022-03-19T18:30:00+00:00'),
      endAt: addDays(new Date(), 3),
      price: 10,
      supplyAvailable: 4200,
      totalPriceInSol: 0.8,
      periodName: 'Holder Sale',
      description: 'Staking 1 Best Bud gives you access to mint 1 Mary Jane',
      maxPerWallet: 5,
      isWhitelist: true,
      pricings: {
        createMany: {
          data: [
            {
              isSol: true,
              amount: 0.69,
              currency: 'SOL',
            },
            {
              isSol: false,
              token: config.allToken,
              amountInSol: 0.11,
              currency: 'ALL',
            },
          ],
        },
      },
    },
  })

  console.log('mintingPeriod', mintingPeriod)

  await prisma.mintingPeriod.create({
    data: {
      projectId: project.id,
      startAt: new Date('2022-03-20T20:00:00+00:00'),
      endAt: new Date('2022-03-21T19:00:00+00:00'),
      price: 4.2,
      supplyAvailable: 4200,
      totalPriceInSol: 4.2,
      maxPerWallet: 5,
      isWhitelist: false,
      periodName: 'Public Sale',
      pricings: {
        create: {
          isSol: true,
          amount: 4.2,
          currency: 'SOL',
        },
      },
    },
  })

  return project
}

async function createStoneheadsData() {
  const project = await prisma.project.create({
    data: {
      desktoBannerUrl:
        'https://all-blue.s3.us-west-1.amazonaws.com/stoneheads/hero-graphic.png',
      mobileBannerUrl:
        'https://all-blue.s3.us-west-1.amazonaws.com/stoneheads/hero-graphic.png',
      profilePictureUrl:
        'https://all-blue.s3.us-west-1.amazonaws.com/stoneheads/pfp.gif',
      logoUrl:
        'https://all-blue.s3.us-west-1.amazonaws.com/stoneheads/logo.png',
      projectDescription:
        '2420 unique OG Stoneheads is a passion project started by 3 friends, with a vision to create a project backed by strong utilities such as StoneLab, Stonemine & Mutations. Allowing community to earn Active & Passive income through many different mechanisms. Powered by $KIEF, a stable token designed for the community. 42% of primary & secondary funds will be injected to $KIEF. Fokit & Crazy parties.',
      projectName: 'OG Stoneheads',
      identifier: 'OGStoneheadsTest',
      projectUrlIdentifier: 'og_stoneheads',
      creatorName: 'OG Stoneheads',
      isIncubator: false,
      isDoxxed: true,
      isVerified: true,
      publicMintPrice: 1,
      publicMintStart: new Date('2022-05-19T20:00:00+00:00'),
      reservedPublicSupply: 0,
      totalSupply: 2420,
      candyMachineId: '-',
      utilities: {
        createMany: {
          data: [
            {
              headline: 'Staking',
              description:
                'When you stake your Stonehead, he chills and smokea all day, collecting $KIEF in his grinder.',
            },
            {
              headline: 'StoneMine Treasury',
              description:
                'A treasury of NFTs which will be given away in raffles & auctions using $KIEF.',
            },
            {
              headline: 'StoneheadDAO',
              description:
                'Alpha info & a unique voting system deciding the purchases for the StoneMine.',
            },
            {
              headline: 'StoneLab utility',
              description:
                'Providing services to projects in and injecting to $KIEF. Holders get to 10% through referrals.',
            },
            {
              headline: 'One of One Stonehead',
              description:
                'Burn 3 Stoneheads+ $KIEF and get a custom 1/1 Stonehead',
            },
            {
              headline: 'Party Island',
              description:
                'Burn 3 OGS + $KIEF and send Stonehead to the Party Island to get a Cokehead who will earn more $KIEF',
            },
            {
              headline: '3D Rehab',
              description:
                'After the Rehab, he will come back 3D and sober, being more productive and earning more $KIEF per day',
            },
            {
              headline: 'Stonehead Partys & Live Events',
              description:
                'Exclusive Stoner Events all around the globe, parties and web3 talent show to get paid trip to Ibiza',
            },
          ],
        },
      },
      teamMembers: {
        createMany: {
          data: [
            {
              memberName: 'Yung Breezy',
              imageUrl:
                'https://all-blue.s3.us-west-1.amazonaws.com/stoneheads/team/yung-breezy.jpeg',
              twitterUrl: 'https://twitter.com/likeapro871',
              description:
                'Artist & Web Developer - Sales man bringing ideas to life with Various experience & skills in the web3 space, with strong passion for dev, art and marketing.',
            },
            {
              memberName: 'OG Dre',
              imageUrl:
                'https://all-blue.s3.us-west-1.amazonaws.com/stoneheads/team/og-dre.jpeg',
              twitterUrl: 'https://twitter.com/OG_Stonette',
              description:
                'Marketing & Financial Director - Creativity specialist bringing ideas to table. Key to keeping the analysis on point and running a numbers game.',
            },
            {
              memberName: 'OG Biggie',
              imageUrl:
                'https://all-blue.s3.us-west-1.amazonaws.com/stoneheads/team/og-biggie.jpeg',
              twitterUrl: 'https://twitter.com/OGBiggi3',
              description:
                'Community manager & Designer - Mentality freak in the team who makes sure that everything is finished on time, keeping a schedule and executing on it.',
            },
          ],
        },
      },
      roadmapPeriods: {
        create: {
          periodName: 'Phase 1',
          roadmapItems: {
            createMany: {
              data: [
                {
                  headline: 'Return of the Ancients',
                  description:
                    'Marketing and Discord server with full Whitepaper and $KIEF Tokenomics',
                },
              ],
            },
          },
        },
      },
    },
  })

  await prisma.projectRoadmapPeriod.create({
    data: {
      projectId: project.id,
      periodName: 'Phase 2',
      roadmapItems: {
        createMany: {
          data: [
            {
              headline: 'Turning Stone into Bread',
              description:
                'Staking & injecting funds to $KIEF, raffles, auctions, StoneMine Bank.',
            },
            {
              headline: 'StoneheadDAO',
              description:
                'Alpha chat with all major decisions, voting, analysis & WL spots.',
            },
          ],
        },
      },
    },
  })

  await prisma.projectRoadmapPeriod.create({
    data: {
      projectId: project.id,
      periodName: 'Phase 3',
      roadmapItems: {
        createMany: {
          data: [
            {
              headline: 'StoneLab',
              description:
                'Marketing services, Doxxing etc. Inject funds from Stonelab to $KIEF.',
            },
            {
              headline: '$KIEF Store',
              description:
                'Burn 3 OGS + $KIEF for a custom 1of1 (max 42) with special utilities.',
            },
          ],
        },
      },
    },
  })

  await prisma.projectRoadmapPeriod.create({
    data: {
      projectId: project.id,
      periodName: 'Phase 4',
      roadmapItems: {
        createMany: {
          data: [
            {
              headline: 'Party Island (Mutation)',
              description:
                'Mutate OG Stonehead to OG CokeHead and Generate more $KIEF.',
            },
          ],
        },
      },
    },
  })

  await prisma.projectRoadmapPeriod.create({
    data: {
      projectId: project.id,
      periodName: 'Phase 5',
      roadmapItems: {
        createMany: {
          data: [
            {
              headline: 'Rehab (Mutation v2)',
              description:
                'Mutate OG Cokehead to 3D OG Stonehead and Generate even more $KIEF.',
            },
          ],
        },
      },
    },
  })

  await prisma.projectRoadmapPeriod.create({
    data: {
      projectId: project.id,
      periodName: 'Phase 6',
      roadmapItems: {
        createMany: {
          data: [
            {
              headline: 'Fökit Talent Show',
              description:
                'Show talents, skills on Web3 Show and get paid trip to Ibiza (4 people).',
            },
            {
              headline: 'Fökit Meet Ups',
              description:
                'Meet-ups in different cities with the OGS crew and get lit on parties.',
            },
          ],
        },
      },
    },
  })

  const mintingPeriod = await prisma.mintingPeriod.create({
    data: {
      projectId: project.id,
      startAt: new Date('2022-05-19T20:00:00+00:00'),
      endAt: new Date('2022-05-19T21:00:00+00:00'),
      price: 0.75,
      supplyAvailable: 1420,
      totalPriceInSol: 0.75,
      periodName: 'Whitelist',
      maxPerWallet: 1,
      isWhitelist: true,
      pricings: {
        createMany: {
          data: [
            {
              isSol: true,
              amount: 0.75,
              currency: 'SOL',
            },
          ],
        },
      },
    },
  })

  console.log('mintingPeriod', mintingPeriod)

  await prisma.mintingPeriod.create({
    data: {
      projectId: project.id,
      startAt: new Date('2022-05-19T21:00:00+00:00'),
      endAt: new Date('2022-06-19T21:00:00+00:00'),
      price: 1.25,
      supplyAvailable: 2420,
      totalPriceInSol: 1.25,
      maxPerWallet: 5,
      isWhitelist: false,
      periodName: 'Public Sale',
      pricings: {
        create: {
          isSol: true,
          amount: 1.25,
          currency: 'SOL',
        },
      },
    },
  })

  return project
}

async function createPlaneXData() {
  const project = await prisma.project.create({
    data: {
      desktoBannerUrl:
        '',
      mobileBannerUrl:
        '',
      profilePictureUrl:
        'https://all-blue.s3.us-west-1.amazonaws.com/planex/Thumbnail.png',
      logoUrl:
        'https://all-blue.s3.us-west-1.amazonaws.com/planex/pfp.png',
      projectDescription:
        `3,333 Plane-X is ready to take you onboard and serve as your shield in this era of menace. 
        It looks like nothing you have ever seen before, made for life in the Epoch Hiji era, protecting the courageous men who are risking their lives to survive.
        The audiovisual 3D generative art collection includes exclusive airdrops, staking utility, as well as access to the upcoming avatar collection and merch.`,
      projectName: 'PLANE-X',
      identifier: 'PlaneX',
      projectUrlIdentifier: 'plane-x',
      creatorName: 'Plane X',
      isIncubator: false,
      isDoxxed: true,
      isVerified: true,
      publicMintPrice: 1.25,
      publicMintStart: new Date('2022-05-30T20:00:00+00:00'),
      reservedPublicSupply: 0,
      totalSupply: 3333,
      candyMachineId: '-',
      utilities: {
        createMany: {
          data: [
            {
              headline: 'Airdrop',
              description:
                'Exclusive NFT X-Parts airdrop for holders, can be used as multipliers in Plane-X staking.',
            },
            {
              headline: 'Staking',
              description:
                'Stake your Plane-X and accumulate $AVTUR for future utilities.',
            },
            {
              headline: 'Mint Pass to X-Pilot Avatar',
              description:
                'Use your Plane-X as the mint pass to the X-Pilot avatar collection.',
            },
            {
              headline: 'Merch',
              description:
                'Turn your favourit Plane-X into a 3D print art or other line of merchandises.',
            },
            {
              headline: '$AVTUR',
              description:
                'Plane-X native token $AVTUR will be the accepted currency for project utilities & holder events.',
            },
            {
              headline: 'Raffles',
              description:
                `Enjoy the holder's exclusive raffles and auction within Plane-X server.`,
            },
          ],
        },
      },
      teamMembers: {
        createMany: {
          data: [
            {
              memberName: 'Nix Powell',
              imageUrl:
                'https://23lvngarmciqcxnqnqpoosngz4ms53gbq4oljypgqcsen73u.arweave.net/1t-dWmBFgkQFdsGwe50m_mz-xku7MGHHLTh5oCkRv90',
              twitterUrl: 'https://twitter.com/eghisn',
              description:
                'Founder/Artist',
            },
            {
              memberName: 'Introboiz',
              imageUrl:
                'https://arweave.net/0hSzdhD0nvr6FdP7a0vnU_GjMXv3fAcPTEtU6tp5EQY',
              twitterUrl: 'https://twitter.com/introboiz',
              description:
                'Artist',
            },
            {
              memberName: 'Rootnetwork',
              imageUrl:
                'https://arweave.net/qx1qJcp4ZOMjWJB8PTmpvs5U_mUzeFy0sxIgaRHcEzM',
              twitterUrl: 'https://twitter.com/rootnetworkOL',
              description:
                'Sound Artist',
            },
            {
              memberName: 'SULTAN PEYEK',
              imageUrl:
                'https://arweave.net/8Mgy6cuNNwVz5c-k9KaIKJQoMpCZI9iP-CpnJlP1S4U',
              twitterUrl: 'https://twitter.com/sultanpeyek',
              description:
                'Developer - 7+ years web2 ui developer, helped several notable projects on Solana e.g. Zaysan Raptors & Grape Protocol',
            },
            {
              memberName: 'Stellar',
              imageUrl:
                'https://arweave.net/Wnm9x3Gc_jSaGb05CRlL1XEWm3stCRy2p7VTSWLbhn0',
              twitterUrl: 'https://twitter.com/ssstellarrr',
              description:
                'Community Manager - Web2 builder falling in love with NFTs',
            },
            {
              memberName: 'Metahirp',
              imageUrl:
                'https://arweave.net/tMHsZUPvqlE7k11h-JdnzzB2342ySoiKJKZ-NbjEolc',
              twitterUrl: 'https://twitter.com/METAHIRP',
              description:
                'Lead Marketing',
            },
            {
              memberName: 'Mey',
              imageUrl:
                'https://arweave.net/MilHSiCJ1a7rhu6Lb4aXfcMFrNkZRSN52VV7cuIhiTU',
              twitterUrl: 'https://twitter.com/meityfitriani',
              description:
                'Community Manager and Content Writer',
            },
            {
              memberName: 'Overdosexod',
              imageUrl:
                'https://arweave.net/qV5DBLMzU39VsnJAQqFYDOrn2QNDBpddus-PsYbSrbk',
              twitterUrl: 'https://twitter.com/diannovvv',
              description:
                'Mod',
            },
          ],
        },
      },
      roadmapPeriods: {
        create: {
          periodName: 'Phase 1',
          roadmapItems: {
            createMany: {
              data: [
                {
                  headline: '',
                  description:
                    'Plane-X mint day',
                },
                {
                  headline: '',
                  description:
                    'Holder verification within the server',
                },
              ],
            },
          },
        },
      },
    },
  })

  await prisma.projectRoadmapPeriod.create({
    data: {
      projectId: project.id,
      periodName: 'Phase 2',
      roadmapItems: {
        createMany: {
          data: [
            {
              headline: '',
              description:
                'Airdrop X-Parts to holder',
            },
            {
              headline: '',
              description:
                '$AVTUR token release',
            },
            {
              headline: '',
              description:
                'Staking',
            },
          ],
        },
      },
    },
  })

  await prisma.projectRoadmapPeriod.create({
    data: {
      projectId: project.id,
      periodName: 'Phase 3',
      roadmapItems: {
        createMany: {
          data: [
            {
              headline: '',
              description:
                'Launch X-Pilot Avatar',
            },
            {
              headline: '',
              description:
                'Merch lines release',
            },
            {
              headline: '',
              description:
                'Raffles & Auction for holder',
            },
          ],
        },
      },
    },
  })

  const mintingPeriod = await prisma.mintingPeriod.create({
    data: {
      projectId: project.id,
      startAt: new Date('2022-05-30T18:00:00+00:00'),
      endAt: new Date('2022-05-30T20:00:00+00:00'),
      price: 1.0,
      supplyAvailable: 3333,
      totalPriceInSol: 1.0,
      periodName: 'Whitelist',
      maxPerWallet: 1,
      isWhitelist: true,
      pricings: {
        createMany: {
          data: [
            {
              isSol: true,
              amount: 1,
              currency: 'SOL',
            },
          ],
        },
      },
    },
  })

  console.log('mintingPeriod', mintingPeriod)

  await prisma.mintingPeriod.create({
    data: {
      projectId: project.id,
      startAt: new Date('2022-05-30T20:00:00+00:00'),
      endAt: new Date('2022-06-30T20:00:00+00:00'),
      price: 1.25,
      supplyAvailable: 3333,
      totalPriceInSol: 1.25,
      maxPerWallet: 20,
      isWhitelist: false,
      periodName: 'Public Sale',
      pricings: {
        create: {
          isSol: true,
          amount: 1.25,
          currency: 'SOL',
        },
      },
    },
  })

  await prisma.galleryUrl.createMany({
    data: [
      {
        projectId: project.id,
        url: 'https://all-blue.s3.us-west-1.amazonaws.com/planex/gallery/1944.png',
        usedForHeader: true
      },
      {
        projectId: project.id,
        url: 'https://all-blue.s3.us-west-1.amazonaws.com/planex/gallery/844.png',
        usedForHeader: true
      },
      {
        projectId: project.id,
        url: 'https://all-blue.s3.us-west-1.amazonaws.com/planex/gallery/41.png',
        usedForHeader: true
      },
      {
        projectId: project.id,
        url: 'https://all-blue.s3.us-west-1.amazonaws.com/planex/gallery/2291.png',
        usedForHeader: false
      },
      {
        projectId: project.id,
        url: 'https://all-blue.s3.us-west-1.amazonaws.com/planex/gallery/2395.png',
        usedForHeader: false
      },
      {
        projectId: project.id,
        url: 'https://all-blue.s3.us-west-1.amazonaws.com/planex/gallery/3329.png',
        usedForHeader: false
      },
      {
        projectId: project.id,
        url: 'https://all-blue.s3.us-west-1.amazonaws.com/planex/gallery/3330.png',
        usedForHeader: false
      },
      {
        projectId: project.id,
        url: 'https://all-blue.s3.us-west-1.amazonaws.com/planex/gallery/3331.png',
        usedForHeader: false
      },
      {
        projectId: project.id,
        url: 'https://all-blue.s3.us-west-1.amazonaws.com/planex/gallery/3332.png',
        usedForHeader: false
      },
    ]
  })
  return project
}

program.parse(process.argv)
