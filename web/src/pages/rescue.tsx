import { useWallet } from '@solana/wallet-adapter-react'
import dynamic from 'next/dynamic'
import React, { useEffect, useMemo, useState } from 'react'
import { useAsyncFn } from 'react-use'
import {
  breedingIdl,
  breedingProgramId,
  connection,
  livingSacApesCount,
  nuked,
  puffToken,
} from '../config/config'
import useWalletBalance, {
  WalletBalanceProvider,
} from '../utils/useWalletBalance'
import * as web3 from '@solana/web3.js'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Link,
  Progress,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Program, Provider } from '@project-serum/anchor'
import {
  getTokenAccount,
  getTokenAccountAdressOrCreateTokenAccountInstruction,
} from '../utils/solUtils'
import Header from '../components/Header'
import {
  NukedNft,
  NukedNftToSelect,
} from '../modules/breeding/components/NukedNft'
import { trpc } from '../utils/trpc'
import {
  getApeUsed,
  useAllApeUsed,
  useBreedingAccounts,
  useBreedingAccountsOfRenters,
  useRentableAccounts,
  useRentAccounts,
  useRescueMissionStats,
} from '../modules/breeding/breeding.hooks'
import { NftMetadata } from '../utils/nftmetaData.type'
import { RescueTeam } from '../modules/breeding/components/RescueTeam'
import { createRevealInstruction } from '../modules/breeding/breeding.utils'
import toast from 'react-hot-toast'
import useWalletNfts from '../utils/useWalletNFTs'
import SelectApeModal from '../modules/breeding/components/SelectApeModal'
import { CloseIcon } from '@chakra-ui/icons'
import { useModal } from '../modules/common/Modal'
import RecruitingSystem from '../modules/breeding/components/RecruitingSystem'
import { program } from 'commander'
import { GradientButton } from '../components/GradientButton'
import { GradientText } from '../components/GradientText'
import Countdown from 'react-countdown'
import { addDays } from 'date-fns'
import { MainLayout } from '../layouts/MainLayout'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

export type RescueApe =
  | NftMetadata
  | NonNullable<ReturnType<typeof useRentableAccounts>['value']>[0]

function Breeding() {
  const wallet = useWallet()
  const { connected } = wallet
  const [balance] = useWalletBalance()
  const walletNftsRes = useWalletNfts()
  const allApesUsedRes = useAllApeUsed()
  console.log(allApesUsedRes.apesUsed)

  const [ape1, setApe1] = useState<NftMetadata>()
  const [ape2, setApe2] = useState<RescueApe>()
  const modal = useModal()

  const ape1Modal = useDisclosure()
  const ape2Modal = useDisclosure()
  const rentalModal = useDisclosure()

  const [apeUsedPubkey, setApeUsedPubkey] = useState('')

  const ape2Nft = ape2 && 'account' in ape2 ? ape2.nft : ape2

  const readyForBreeding = ape1 && ape2

  const { value: breedingAccounts, ...breedingAccountsRes } =
    useBreedingAccounts(wallet)

  const BreedingAccountsOfRentersRes = useBreedingAccountsOfRenters(wallet)

  const rentingAccountsRes = useRentAccounts(wallet)

  const rentableAccountsRes = useRentableAccounts(wallet)

  const { value: rentableAccounts } = rentableAccountsRes

  useEffect(() => {
    console.log(
      'breedingAccounts',
      breedingAccounts?.map((b) => ({
        ...b,
        pubKey: b.breedingAccount.publicKey.toBase58(),
      }))
    )
  }, [breedingAccounts])

  /* console.log('wallet', wallet) */

  const startBreedMutation = trpc.useMutation('breeding.startBreed', {})
  const revealMutation = trpc.useMutation('breeding.reveal', {})

  const [startBreedingRes, startBreeding] = useAsyncFn(async () => {
    if (!wallet.signTransaction) return null

    console.log('ape2 in startBreeding', ape2)

    const ape2Pubkey =
      ape2 && 'pubkey' in ape2 ? ape2?.pubkey! : ape2?.nft.pubkey!
    const rentingAccount =
      ape2 && 'account' in ape2 ? ape2.account.publicKey.toBase58() : undefined

    const res = await startBreedMutation.mutateAsync({
      user: wallet.publicKey!.toBase58(),
      ape1: ape1?.pubkey.toBase58()!,
      ape2: ape2Pubkey.toBase58(),
      rentingAccount: rentingAccount,
    })
    const transaction = web3.Transaction.from(Buffer.from((res as any).trans))

    await wallet.signTransaction(transaction)

    const serial = transaction.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
    })
    try {
      const tx = await connection.sendRawTransaction(serial)

      await connection.confirmTransaction(tx, 'recent')

      breedingAccountsRes.retry()

      setApe1(undefined)
      setApe2(undefined)

      toast.success('sent apes on rescue mission')
    } catch (e: any) {
      if (e.message.includes('0x1772')) {
        toast.error('Your ape needs to cool down from the last rescue')
      } else if (e.message.includes('0x1')) {
        toast.error('You need more $PUFF or Solana')
      } else if (e.message.includes('0xBC4')) {
        toast.error('The ape is already rented.')
      } else toast.error(e.message)
      console.error('error on sending to rescue mission', e)
    }
  }, [wallet, ape1, ape2])

  const [revealResV2, revealV2] = useAsyncFn(
    async (
      breedingAccount: NonNullable<
        ReturnType<typeof useBreedingAccounts>['value']
      >[0]
    ) => {
      console.log('starting reveal v2')

      if (!wallet.signTransaction) return null

      console.log('starting reveal v2 a')

      try {
        const res = await revealMutation.mutateAsync({
          user: wallet.publicKey!.toBase58(),
          rescuePubKey: breedingAccount.breedingAccount.publicKey.toBase58(),
        })
        const transaction = web3.Transaction.from(
          Buffer.from((res as any).trans)
        )

        await wallet.signTransaction(transaction)

        const serial = transaction.serialize({
          verifySignatures: false,
          requireAllSignatures: false,
        })

        const tx = await connection.sendRawTransaction(serial)

        await connection.confirmTransaction(tx, 'recent')

        toast.success('Reveal sucessfully, check your wallet!')
        breedingAccountsRes.retry()

        return {
          success: true,
          pubKey: breedingAccount.breedingAccount.publicKey.toBase58(),
        }
      } catch (e: any) {
        if (e.message.includes('0x1771')) {
          toast.error('Your ape is not ready to reveal')
        } else if (e.message.includes('0x1')) {
          toast.error('You need more $PUFF or Solana')
        } else toast.error(e.message)
        console.error('error on sending to rescue mission', e)
      }
    },
    [wallet, ape1, ape2]
  )

  const [revealRes, reveal] = useAsyncFn(
    async (
      breedingAccount: NonNullable<
        ReturnType<typeof useBreedingAccounts>['value']
      >[0]
    ) => {
      if (!wallet.signTransaction) return null

      const provider = new Provider(connection, wallet.wallet! as any, {
        commitment: 'confirmed',
      })
      const program = new Program(breedingIdl, breedingProgramId, provider)

      const ape1Pubkey = breedingAccount.breedingAccount.account.ape1
      const ape2Pubkey = breedingAccount.breedingAccount.account.ape2

      console.log('apes', { ape1Pukey: ape1Pubkey, ape2Pubkey })

      const user = wallet.publicKey!
      const breedingAccountPubkey = new web3.PublicKey(
        breedingAccount.breedingAccount.publicKey
      )

      const userNftAccountCreation =
        await getTokenAccountAdressOrCreateTokenAccountInstruction({
          mint: ape1Pubkey,
          user,
          connection,
        })
      const ape1TokenAccount = userNftAccountCreation.address

      const userNftAccountCreation2 = !breedingAccount.breedingAccount.account
        .rentalUser
        ? await getTokenAccountAdressOrCreateTokenAccountInstruction({
            mint: ape2Pubkey,
            user,
            connection,
          })
        : await getTokenAccountAdressOrCreateTokenAccountInstruction({
            mint: ape2Pubkey,
            user: breedingAccount.breedingAccount.account.rentalUser as any,
            connection,
            payer: user,
          })

      const ape2TokenAccount = userNftAccountCreation2.address

      console.log('puffToken', puffToken.toBase58())

      const instruction = await createRevealInstruction({
        ape1: ape1Pubkey,
        ape2: ape2Pubkey,
        user: user,
        ape1TokenAccount: ape1TokenAccount,
        ape2TokenAccount: ape2TokenAccount,
        adminUser: nuked.address,
        breedingAccount: breedingAccountPubkey!,
      })

      const recentBlockhash = await connection.getRecentBlockhash()
      const transaction = new web3.Transaction({
        feePayer: user,
        recentBlockhash: recentBlockhash.blockhash,
      })

      if (userNftAccountCreation.instructions.length > 0) {
        transaction.add(...userNftAccountCreation.instructions)
      }

      if (userNftAccountCreation2.instructions.length > 0) {
        transaction.add(...userNftAccountCreation2.instructions)
      }

      transaction.add(instruction)

      await wallet.signTransaction(transaction)

      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
      })

      try {
        const res = await revealMutation.mutateAsync({
          user: wallet.publicKey!.toBase58(),
          trans: serializedTransaction.toJSON(),
          rescuePubKey: breedingAccount.breedingAccount.publicKey.toBase58(),
        })
        toast.success('reveal sucessfully')
        breedingAccountsRes.retry()
      } catch (e: any) {
        if (e.message.includes('0x1771')) {
          toast.error('Your ape is not ready to reveal')
        } else if (e.message.includes('0x1')) {
          toast.error('You need more $PUFF or Solana')
        } else toast.error(e.message)
        console.error('error on sending to rescue mission', e)
      }
    },
    [wallet, ape1, ape2]
  )

  const [getApeUsedCounterRes, getApeUsedCounter] = useAsyncFn(
    async (ape: string) => {
      const provider = new Provider(connection, {} as any, {
        commitment: 'confirmed',
      })

      const program = new Program(breedingIdl, breedingProgramId, provider)

      const apeUsedAddress = await web3.PublicKey.findProgramAddress(
        [Buffer.from('apeUsed'), new web3.PublicKey(ape).toBuffer()],
        program.programId
      )

      try {
        const apeUsedAccount = await program.account.apeUsed.fetch(
          apeUsedAddress[0]
        )

        if (!apeUsedAccount) return { counter: 0, lastUseStart: null }

        return apeUsedAccount
      } catch (error) {
        return { counter: 0, lastUseStart: null }
      }
    },
    [wallet]
  )

  const stats = useRescueMissionStats()

  const missionCount = stats.value?.missionCounterAfterInitialPhase
  console.log({ missionCount })

  const [missionCost, setMissionCost] = useState(2099)
  const [earliestNextRescue, setEarliestNextRescue] = useState<Date>()

  useEffect(() => {
    const getMissionCost = async () => {
      let missionCostCalc = Math.ceil(
        1780 *
          Math.pow(1.042, Math.ceil((missionCount ?? 0) / 100)) *
          Math.pow(1.265, 0) *
          Math.pow(1.265, 0)
      )
      let earliestNextRescueCalc = undefined

      const provider = new Provider(connection, {} as any, {
        commitment: 'confirmed',
      })

      const program = new Program(breedingIdl, breedingProgramId, provider)

      if (ape1) {
        const ape1UsedAccont = await getApeUsed(ape1.pubkey)
        missionCostCalc =
          missionCostCalc * Math.pow(1.2649, ape1UsedAccont.counter)
        if (ape1UsedAccont.lastUseStart) {
          const nextRunStart = addDays(
            new Date(ape1UsedAccont.lastUseStart?.toNumber() * 1000),
            10
          )
          if (
            nextRunStart.getTime() - new Date().getTime() > 0 &&
            (!earliestNextRescue ||
              nextRunStart.getTime() - earliestNextRescue.getTime())
          ) {
            earliestNextRescueCalc = nextRunStart
          }
        }
      }

      if (ape2Nft) {
        const ape2UsedAccont = await getApeUsed(ape2Nft.pubkey)
        missionCostCalc =
          missionCostCalc * Math.pow(1.2649, ape2UsedAccont.counter)
        if (ape2UsedAccont.lastUseStart) {
          const nextRunStart = addDays(
            new Date(ape2UsedAccont.lastUseStart?.toNumber() * 1000),
            10
          )
          if (
            nextRunStart.getTime() - new Date().getTime() > 0 &&
            (!earliestNextRescue ||
              nextRunStart.getTime() - earliestNextRescue.getTime()) &&
            (!earliestNextRescueCalc ||
              nextRunStart.getTime() - earliestNextRescueCalc.getTime())
          ) {
            earliestNextRescueCalc = nextRunStart
          }
        }
      }

      console.log('calc mission cost', missionCostCalc)

      setMissionCost(Math.ceil(missionCostCalc))
      if (earliestNextRescueCalc) setEarliestNextRescue(earliestNextRescueCalc)
    }

    getMissionCost()
  }, [missionCount, ape1, ape2Nft])

  return (
    <MainLayout
      navbar={{
        colorTheme: 'dark',
        showWallet: false,
        bgTransparent: true,
      }}
    >
      <Box background={'linear-gradient(to bottom, #000000 0%, #30424D 250%)'}>
        <SelectApeModal
          modal={ape1Modal}
          title='Select first ape for rescue mission'
          walletNftsRes={walletNftsRes}
          apesUsedAllRes={allApesUsedRes}
          onSelect={(ape) => {
            setApe1('pubkey' in ape ? ape : ape.nft)
          }}
          disableRole={
            ape2Nft?.attributes.find((a) => a.trait_type === 'Role')?.value
          }
          rentableAccountsRes={rentableAccountsRes}
        />
        <SelectApeModal
          modal={ape2Modal}
          apesUsedAllRes={allApesUsedRes}
          title='Select second ape for rescue mission'
          walletNftsRes={walletNftsRes}
          onSelect={(ape) => {
            setApe2(ape)
          }}
          disableRole={
            ape1?.attributes.find((a) => a.trait_type === 'Role')?.value
          }
          showRental={true}
          rentableAccountsRes={rentableAccountsRes}
        />
        <Box
          bgImage="url('/images/purple-smoke-bg.png')"
          bgSize='cover'
          bgRepeat='no-repeat'
          pb='3rem'
        >
          <Stack
            w='auto'
            pt='4rem'
            px={['2', '6', '20']}
            spacing='0'
            color='white'
            boxShadow='lg'
          >
            <Stack
              d='flex'
              direction={['column', 'row']}
              spacing={4}
              justifyContent='space-evenly'
              p='6'
            >
              <Box
                shadow='lg'
                rounded='lg'
                p={1}
                boxShadow='inset 0px 4px 56px rgba(255, 255, 255, 0.18)'
                backdropFilter='blur(22px)'
                d='flex'
                justifyContent={'center'}
              >
                <Box d='flex' alignItems='center' justifyContent={'center'}>
                  <Text p='1'>Balance: </Text>
                  <Text pl='1' fontWeight='bold'>
                    {balance.toFixed(2)}{' '}
                  </Text>

                  <Text
                    pr='2'
                    pl='1'
                    fontWeight='bold'
                    textDecor='transparent'
                    bgClip='text'
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, #00FFA3, #03E1FF, #DC1FFF)`,
                    }}
                  >
                    {' '}
                    SOL
                  </Text>
                </Box>
              </Box>

              <Box>
                <WalletMultiButton />
              </Box>
            </Stack>

            <Stack p='6' spacing='0'>
              <Heading
                p='1'
                textAlign={'center'}
                fontSize={{ base: '3xl', lg: '5xl' }}
                fontWeight={700}
                fontFamily={'Montserrat'}
              >
                NUKED APE RESCUE MISSIONS
              </Heading>
              <Text
                p='1'
                textAlign={'center'}
                color='textGrey'
                fontFamily='Montserrat'
                fontSize='smaller'
                fontWeight={600}
              >
                Send 2 Stoned Apes on a mission to rescue a Nuked Ape. <br />
                <Link
                  href='/nukedapes'
                  _hover={{ color: 'white', textDecoration: 'none' }}
                >
                  Learn more
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
        <Box
          backgroundImage={'/images/nukedapes-bg.jpg'}
          backgroundSize={'cover'}
        >
          <Stack
            spacing='2rem'
            paddingY='3rem'
            minHeight={'80vh'}
            display='flex'
            justifyContent={'center'}
            alignItems={'center'}
            color='white'
            bg='rgba(0,0,0,0.25)'
          >
            <Grid
              column={{ base: 1, lg: 3 }}
              gap={2}
              templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(9, 1fr)' }}
            >
              <GridItem
                colSpan={{ base: 1, lg: 7 }}
                colStart={{ base: 0, lg: 2 }}
              >
                {true && (
                  <Stack p='1' spacing='1' alignItems='center' width='100%'>
                    <Flex justifyContent='space-between' width={['88%', '82%']}>
                      <Heading
                        fontFamily={'body'}
                        color='white'
                        fontSize='md'
                        fontWeight='700'
                      >
                        {stats.value?.percentage
                          ? `${stats.value.percentage}% Apes on Mission`
                          : ``}
                      </Heading>
                      <Heading
                        fontFamily={'body'}
                        as='div'
                        color='white'
                        fontSize='md'
                        fontWeight='700'
                      >
                        {stats?.value?.apesOnMission ? (
                          stats?.value?.apesOnMission
                        ) : (
                          <Spinner thickness='3px' />
                        )}{' '}
                        / {livingSacApesCount}
                      </Heading>
                    </Flex>

                    {/* {stats.loading && (
            <Stack direction='row'>
              <Text>Loading Stats</Text>
              <Spinner />
            </Stack>
          )} */}
                    <Progress
                      isIndeterminate={stats.loading}
                      colorScheme='whiteAlpha'
                      fill='white'
                      background='rgba(255, 255, 255, 0.3)'
                      size='md'
                      value={Number(stats.value?.percentage)}
                      width={['90%', '82%']}
                      borderRadius='15px'
                    />
                  </Stack>
                )}
              </GridItem>
              <GridItem
                colSpan={3}
                colStart={{ base: 0, lg: 2 }}
                display='flex'
                alignItems={'center'}
                justifyContent={'center'}
              >
                <NukedNftToSelect
                  headerText='Rescue Hero 1'
                  nft={ape1}
                  buttonText='Select Ape 1'
                  onSelect={() => ape1Modal.onOpen()}
                  unSelect={() => setApe1(undefined)}
                ></NukedNftToSelect>
              </GridItem>
              <GridItem
                colSpan={1}
                display='flex'
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Stack>
                  <Text textAlign={'center'} fontSize={'sm'} fontWeight={700}>
                    {missionCost} $PUFF
                  </Text>
                  <GradientButton
                    rounded='full'
                    background='secondary'
                    transition='ease-in-out all .2s'
                    onClick={(e) => {
                      startBreeding()
                    }}
                    isLoading={startBreedingRes.loading}
                    boxShadow='lg'
                  >
                    <Text
                      color='white'
                      as='span'
                      fontWeight='600'
                      transition='ease-in-out all .2s'
                    >
                      Start Mission
                    </Text>
                  </GradientButton>
                  {earliestNextRescue && (
                    <Text textAlign={'center'} fontSize={'sm'} fontWeight={700}>
                      Startable in{' '}
                      <Countdown
                        daysInHours={true}
                        date={earliestNextRescue.getTime()}
                        onComplete={() => setEarliestNextRescue(undefined)}
                      ></Countdown>
                    </Text>
                  )}
                </Stack>
              </GridItem>
              <GridItem
                colSpan={3}
                display='flex'
                alignItems={'center'}
                justifyContent={'center'}
              >
                <NukedNftToSelect
                  headerText='Rescue Hero 2'
                  nft={ape2Nft}
                  buttonText='Select or Recruit Ape 2'
                  onSelect={() => ape2Modal.onOpen()}
                  unSelect={() => setApe2(undefined)}
                ></NukedNftToSelect>
              </GridItem>
            </Grid>
          </Stack>
        </Box>

        <Stack
          paddingTop='2rem'
          spacing='5rem'
          minHeight='80vh'
          paddingX={['2.5%', '5%', '10%']}
          mx='auto'
          bgGradient='linear(to-b, #30424D -15%, #000000 110%)'
          pb='40px'
          backgroundSize='cover'
        >
          <Stack alignItems='center'>
            {/* {breedingAccounts && breedingAccounts.length > 0 && ( */}
            <Heading color='white' fontWeight={700} fontFamily={'body'}>
              On Rescue Mission
            </Heading>
            {/* )} */}

            {breedingAccountsRes.loading && (
              <Stack direction='row'>
                <Spinner color='white' />
              </Stack>
            )}

            <SimpleGrid
              p={3}
              borderRadius={'lg'}
              columns={[1, 2, 2]}
              maxWidth='60rem'
              width='100%'
              background={'rgba(255,255,255,0.15)'}
            >
              {breedingAccounts &&
                breedingAccounts.map((breedingAccount, i) => {
                  if (
                    breedingAccount.breedingAccount.publicKey.toBase58() ===
                      revealResV2.value?.pubKey &&
                    revealResV2.value.success
                  ) {
                    return <></>
                  }
                  return (
                    <RescueTeam
                      key={breedingAccount.breedingAccount.publicKey.toBase58()}
                      loading={revealResV2.loading}
                      breedingAccount={breedingAccount!}
                      onReveal={() => revealV2(breedingAccount)}
                    />
                  )
                })}
            </SimpleGrid>

            <SimpleGrid></SimpleGrid>
          </Stack>

          <Stack p={0} spacing='2rem' alignItems='center'>
            <Heading color='white' fontWeight={700} fontFamily={'body'}>
              Recruiting System
            </Heading>
            <RecruitingSystem
              rentAccountsRes={rentingAccountsRes}
              apesUsedAllRes={allApesUsedRes}
              walletNftsRes={walletNftsRes}
              breedingAccountsOfRentersRes={BreedingAccountsOfRentersRes}
              title='Recruiting System'
            />
          </Stack>

          <Stack spacing='1rem' alignItems='center'>
            <Heading
              color='white'
              fontWeight={700}
              fontFamily={'body'}
              fontSize='lg'
            >
              Check Ape Use Counter and CoolDown
            </Heading>

            <Input
              fontSize='14px'
              color={'white'}
              placeholder='Enter Ape Mint Address (from Solscan)'
              value={apeUsedPubkey}
              onChange={(e) => setApeUsedPubkey(e.target.value)}
              maxWidth={'500px'}
            />
            {getApeUsedCounterRes.value && (
              <Text textAlign={'center'} fontSize={'md'} color='white'>
                Ape was used {getApeUsedCounterRes.value?.counter} times and was
                last sent to rescue mission on{' '}
                {getApeUsedCounterRes.value?.lastUseStart
                  ? new Date(
                      getApeUsedCounterRes.value?.lastUseStart.toNumber() * 1000
                    ).toLocaleString()
                  : ''}
                .
              </Text>
            )}
            <Button onClick={(e) => getApeUsedCounter(apeUsedPubkey)}>
              Check
            </Button>
          </Stack>
        </Stack>
      </Box>
    </MainLayout>
  )
}

const WalletConnectionProvider = dynamic(
  () => import('../components/WalletConnectionProvider'),
  {
    ssr: false,
  }
)

export default function HOC() {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <Breeding />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}
