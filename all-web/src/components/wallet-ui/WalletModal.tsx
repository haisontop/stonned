import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base'
import { useWallet, Wallet } from '@solana/wallet-adapter-react'
import React, {
  FC,
  MouseEvent,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react'
import { createPortal } from 'react-dom'
import { Collapse } from './Collapse'
import { useWalletModal } from './useWalletModal'
import { WalletListItem } from './WalletListItem'
import { WalletSVG } from './WalletSVG'
import { useColorMode } from '@chakra-ui/system'
import { DotProgress } from './DotProgress'

export interface WalletModalProps {
  className?: string
  container?: string
}

export const WalletModal: FC<WalletModalProps> = ({
  className = '',
  container = 'body',
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { wallets, select, wallet, connect, connecting, connected } =
    useWallet()
  const { setVisible } = useWalletModal()
  const [expanded, setExpanded] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)
  const [portal, setPortal] = useState<Element | null>(null)
  const { colorMode } = useColorMode()
  const [showConnected, setShowConnected] = useState(false)

  const [installedWallets, otherWallets] = useMemo(() => {
    const installed: Wallet[] = []
    const notDetected: Wallet[] = []
    const loadable: Wallet[] = []

    for (const wallet of wallets) {
      if (wallet.readyState === WalletReadyState.NotDetected) {
        notDetected.push(wallet)
      } else if (wallet.readyState === WalletReadyState.Loadable) {
        loadable.push(wallet)
      } else if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(wallet)
      }
    }

    return [installed, [...loadable, ...notDetected]]
  }, [wallets])

  const getStartedWallet = useMemo(() => {
    return installedWallets.length
      ? installedWallets[0]
      : wallets.find(
          (wallet: { adapter: { name: WalletName } }) =>
            wallet.adapter.name === 'Torus'
        ) ||
          wallets.find(
            (wallet: { adapter: { name: WalletName } }) =>
              wallet.adapter.name === 'Phantom'
          ) ||
          wallets.find(
            (wallet: { readyState: any }) =>
              wallet.readyState === WalletReadyState.Loadable
          ) ||
          otherWallets[0]
  }, [installedWallets, wallets, otherWallets])

  const hideModal = useCallback(() => {
    setFadeIn(false)
    setTimeout(() => setVisible(false), 150)
  }, [])

  const handleClose = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      hideModal()
    },
    [hideModal]
  )

  const handleWalletClick = useCallback(
    (event: MouseEvent, walletName: WalletName) => {
      select(walletName)
    },
    [select, handleClose]
  )

  const handleCollapseClick = useCallback(
    () => setExpanded(!expanded),
    [expanded]
  )

  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      const node = ref.current
      if (!node) return

      // here we query all focusable elements
      const focusableElements = node.querySelectorAll('button')
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        // if going backward by pressing tab and firstElement is active, shift focus to last focusable element
        if (document.activeElement === firstElement) {
          lastElement.focus()
          event.preventDefault()
        }
      } else {
        // if going forward by pressing tab and lastElement is active, shift focus to first focusable element
        if (document.activeElement === lastElement) {
          firstElement.focus()
          event.preventDefault()
        }
      }
    },
    [ref]
  )

  useLayoutEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideModal()
      } else if (event.key === 'Tab') {
        handleTabKey(event)
      }
    }

    // Get original overflow
    const { overflow } = window.getComputedStyle(document.body)
    // Hack to enable fade in animation after mount
    setTimeout(() => setFadeIn(true), 0)
    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden'
    // Listen for keydown events
    window.addEventListener('keydown', handleKeyDown, false)

    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', handleKeyDown, false)
    }
  }, [hideModal, handleTabKey])

  useLayoutEffect(
    () => setPortal(document.querySelector(container)),
    [container]
  )

  const handleConnected = useCallback(() => {
    setShowConnected(true)
    setTimeout(() => {
      hideModal()
      setShowConnected(false)
    }, 1000)
  }, [hideModal])

  useEffect(() => {
    if (connected && connecting) handleConnected()
  }, [connecting, connected, handleConnected])

  const ConnectingUI = useMemo(() => {
    return (
      <Stack alignItems={'center'} spacing='0.6rem'>
        <Heading fontSize={'1.25rem'} fontWeight='600'>
          Connecting...
        </Heading>
        <Text fontSize={'0.75rem'} color='#888888'>
          Please unlock your Phantom wallet
        </Text>
        <HStack justifyContent={'center'} paddingTop='2rem' spacing={'1rem'}>
          <Image src='/icons/logo-solana.svg' width={'3.2rem'} fill='#C4C4C4' />
          <DotProgress />
          <Image src='/icons/logo-black.svg' width={'3.2rem'} />
        </HStack>
      </Stack>
    )
  }, [])

  const ConnectedUI = useMemo(() => {
    return (
      <HStack alignItems={'center'}>
        <Heading fontSize={'1.25rem'} fontWeight='600'>
          Connected 🎉
        </Heading>
      </HStack>
    )
  }, [])

  return (
    portal &&
    createPortal(
      <div
        aria-labelledby='wallet-adapter-modal-title'
        aria-modal='true'
        className={`wallet-adapter-modal ${
          fadeIn && 'wallet-adapter-modal-fade-in'
        } ${className}`}
        ref={ref}
        role='dialog'
      >
        <div className='wallet-adapter-modal-container'>
          <div
            className={`wallet-adapter-modal-wrapper ${
              colorMode === 'dark' && 'darkMode'
            }`}
          >
            <button
              onClick={handleClose}
              className='wallet-adapter-modal-button-close'
            >
              <svg
                width='14'
                height='13'
                viewBox='0 0 14 13'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <line
                  x1='13.1406'
                  y1='0.707107'
                  x2='1.70903'
                  y2='12.1387'
                  stroke='#393E46'
                  strokeLinecap='round'
                />
                <line
                  x1='0.5'
                  y1='-0.5'
                  x2='16.6667'
                  y2='-0.5'
                  transform='matrix(0.707107 0.707107 0.707107 -0.707107 1 0)'
                  stroke='#393E46'
                  strokeLinecap='round'
                />
              </svg>
            </button>
            <Image src='/icons/Logo.svg' width='30px' />
            {installedWallets.length ? (
              <>
                {showConnected ? (
                  <Box margin='8rem 0'>{ConnectedUI}</Box>
                ) : connecting ? (
                  <Box margin='8rem 0'>{ConnectingUI}</Box>
                ) : (
                  <>
                    <h1 className='wallet-adapter-modal-title'>
                      Connect a Solana wallet
                    </h1>
                    <ul className='wallet-adapter-modal-list'>
                      {installedWallets.map((wallet) => (
                        <WalletListItem
                          key={wallet.adapter.name}
                          handleClick={(event) =>
                            handleWalletClick(event, wallet.adapter.name)
                          }
                          wallet={wallet}
                        />
                      ))}
                      {otherWallets.length ? (
                        <Collapse
                          expanded={expanded}
                          id='wallet-adapter-modal-collapse'
                        >
                          {otherWallets.map((wallet) => (
                            <WalletListItem
                              key={wallet.adapter.name}
                              handleClick={(event) =>
                                handleWalletClick(event, wallet.adapter.name)
                              }
                              tabIndex={expanded ? 0 : -1}
                              wallet={wallet}
                            />
                          ))}
                        </Collapse>
                      ) : null}
                    </ul>

                    {otherWallets.length ? (
                      <Flex justifyContent={'center'}>
                        <button
                          className='wallet-adapter-modal-list-more'
                          onClick={handleCollapseClick}
                          tabIndex={0}
                        >
                          <span>
                            {expanded ? 'Less options' : 'Show more options '}
                          </span>
                        </button>
                      </Flex>
                    ) : null}

                    <Stack alignItems={'center'}>
                      <Text
                        fontSize={'14px'}
                        color={colorMode === 'dark' ? 'white' : 'black'}
                        fontWeight={600}
                        lineHeight={'150%'}
                      >
                        New to Solana?
                      </Text>
                      <Link
                        href='https://docs.solana.com/de/wallet-guide'
                        isExternal
                      >
                        <Text
                          fontSize={'14px'}
                          color={'#888888'}
                          fontWeight={600}
                          lineHeight={'150%'}
                          marginTop='0 !important'
                        >
                          Learn about wallets
                        </Text>
                      </Link>
                    </Stack>
                  </>
                )}
              </>
            ) : (
              <>
                <h1 className='wallet-adapter-modal-title'>
                  You'll need a wallet on Solana to continue
                </h1>
                <div className='wallet-adapter-modal-middle'>
                  <WalletSVG />
                  <button
                    type='button'
                    className='wallet-adapter-modal-middle-button'
                    onClick={(event) =>
                      handleWalletClick(event, getStartedWallet.adapter.name)
                    }
                  >
                    Get started
                  </button>
                </div>
                {otherWallets.length ? (
                  <>
                    <button
                      className='wallet-adapter-modal-list-more'
                      onClick={handleCollapseClick}
                      tabIndex={0}
                    >
                      <span>
                        {expanded ? 'Hide ' : 'Already have a wallet? View '}
                        options
                      </span>
                      <svg
                        width='13'
                        height='7'
                        viewBox='0 0 13 7'
                        xmlns='http://www.w3.org/2000/svg'
                        className={`${
                          expanded
                            ? 'wallet-adapter-modal-list-more-icon-rotate'
                            : ''
                        }`}
                      >
                        <path d='M0.71418 1.626L5.83323 6.26188C5.91574 6.33657 6.0181 6.39652 6.13327 6.43762C6.24844 6.47872 6.37371 6.5 6.50048 6.5C6.62725 6.5 6.75252 6.47872 6.8677 6.43762C6.98287 6.39652 7.08523 6.33657 7.16774 6.26188L12.2868 1.626C12.7753 1.1835 12.3703 0.5 11.6195 0.5H1.37997C0.629216 0.5 0.224175 1.1835 0.71418 1.626Z' />
                      </svg>
                    </button>
                    <Collapse
                      expanded={expanded}
                      id='wallet-adapter-modal-collapse'
                    >
                      <ul className='wallet-adapter-modal-list'>
                        {otherWallets.map((wallet) => (
                          <WalletListItem
                            key={wallet.adapter.name}
                            handleClick={(event) =>
                              handleWalletClick(event, wallet.adapter.name)
                            }
                            tabIndex={expanded ? 0 : -1}
                            wallet={wallet}
                          />
                        ))}
                      </ul>
                    </Collapse>
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
        <div
          className='wallet-adapter-modal-overlay'
          onMouseDown={handleClose}
        />
      </div>,
      portal
    )
  )
}
