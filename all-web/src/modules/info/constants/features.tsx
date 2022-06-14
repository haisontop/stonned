import { AntiBotMintIcon } from '../icons/AntiBotMintIcon'
import { FreeMintsIcon } from '../icons/FreeMintsIcon'
import { MarketingPushIcon } from '../icons/MarketingPushIcon'
import { RichProjectInformationIcon } from '../icons/RichProjectInformationIcon'
import { SolanaIntegrationIcon } from '../icons/SolanaIntegrationIcon'
import { StakingDayIcon } from '../icons/StakingDayIcon'
import { TokenomicsIcon } from '../icons/TokenomicsIcon'
import { TrustedEnvironmentIcon } from '../icons/TrustedEnvironmentIcon'
import { UnverifedMintIcon } from '../icons/UnverifedMintIcon'
import { CommunityShapeIcon } from '../icons/CommunityShapeIcon'
import { EcoIntegrationShapeIcon } from '../icons/EcoIntegrationShapeIcon'
import { NewProjectJoinShapeIcon } from '../icons/NewProjectJoinShapeIcon'
import { StabilityShapeIcon } from '../icons/StabilityShapeIcon'
import { VerifiedMintsShapeIcon } from '../icons/VerifiedMintsShapeIcon'
import { WhiteListShapeIcon } from '../icons/WhiteListShapeIcon'
import { AdditionalFeature, MainFeature } from '../types'
import { NFTRoadmapShapeIcon } from '../icons/NFTRoadmapShapeIcon'
import { CoinTokenomicsShapeIcon } from '../icons/CoinTokenomicsShapeIcon'
import { ArtStrategyShapeIcon } from '../icons/ArtStrategyShapeIcon'
import { IndustryContactsIcon } from '../icons/IndustryContactsIcon'
import { DAOStructureIcon } from '../icons/DAOStructureIcon'
import { LaunchPlanIcon } from '../icons/LaunchPlanIcon'
import { StackingShapeIcon } from '../icons/StackingShapeIcon'
import { SPLTokenShapeIcon } from '../icons/SPLTokenShapeIcon'
import { EvolutionShapeIcon } from '../icons/EvolutionShapeIcon'
import { SalesBotIcon } from '../icons/SalesBotIcon'
import { BreedingIcon } from '../icons/BreedingIcon'
import { AirdropIcon } from '../icons/AirdropIcon'
import { SPLTokenIcon } from '../icons/SPLTokenIcon'
import { StakingIcon } from '../icons/StakingIcon'

export const ALL_LAUNCH_FEATURES: MainFeature[] = [
  {
    title: 'Community Oriented',
    desc: 'Our platform is community first. This menas community based votings, comments, expert opinions, user profiles and much more.',
    shape: <CommunityShapeIcon />,
  },
  {
    title: 'Whitelist Solutions',
    desc: 'ALL Launch provides solutions to whitelist specific people, wallets or whole communities, without the need of  giving out tokens.',
    shape: <WhiteListShapeIcon />,
    isLeft: true,
  },
  {
    title: 'Verified Mints',
    desc: 'ALL Launch includes doxxing and verification for projects. Verified mints get checked by our team to make sure they are of high quality and potential. ',
    shape: <VerifiedMintsShapeIcon />,
  },
]

export const ALL_COIN_FEATURES: MainFeature[] = [
  {
    title: 'Integration into functioning ecosystem with utilities',
    desc: 'Every member project of ALL Coin creates their own utilties. Therefore joining $ALL means joining an ecosystem with already functioning utilties. These include digital ones such as NFT raffles, SOL casino, coin flips, and IRL products.',
    shape: <EcoIntegrationShapeIcon />,
  },
  {
    title: 'Stability through major liquidity',
    desc: 'Each member project needs to provide major liquidity funds. This makes $ALL stable and reduces risks of major in- or deflation. Further it induces confidence for investors and secures the market against manipulation.',
    shape: <StabilityShapeIcon />,
    isLeft: true,
    topSpacing: 'md',
  },
  {
    title: 'Future utilities coming with every new project joining',
    desc: 'ALL is just getting started. Each new projects brings in new utilities, new ways to create, use and burn $ALL. Therefore the ecosystem is getting stronger and better with every new top-notch project added. ',
    shape: <NewProjectJoinShapeIcon />,
    topSpacing: 'md',
  },
]

export const ALL_STRATEGY_FEATURES: MainFeature[] = [
  {
    title: 'NFT Roadmap',
    desc: 'Successful NFT projects have a strong vision and strategy in place. The value derives directly from its utilities. With our network and experience, we will help you to set up valuable real life utility and usage. ',
    shape: <NFTRoadmapShapeIcon />,
  },
  {
    title: 'Coin Tokenomics',
    desc: 'With expertise in macrofinance and tokenomics, we help developing a solid foundation for your coin, including strategy, burning mechanics, gametheory and data about the circulation and supply. Futher we support in listing your coin and various decentralized exchanges.',
    shape: <CoinTokenomicsShapeIcon />,
    isLeft: true,
    topSpacing: 'sm',
  },
  {
    title: 'Art Strategy',
    desc: 'Great NFTs are emotional and these are generated through great artwork. We provide creative suggestions, consulting on traits, feedback on milestones and if needed, access to our amazing artist community with talented individuals that elevate your artwork to the next level.',
    shape: <ArtStrategyShapeIcon />,
    topSpacing: 'sm',
  },
]

export const ALL_TECH_FEATURES: MainFeature[] = [
  {
    title: 'Staking',
    desc: 'Let holders stake their NFTs to collect tokens. We support individual tokens or integrate natively with $ALL.',
    shape: <StackingShapeIcon />,
  },
  {
    title: 'SPL Token Payment System',
    desc: 'Integration of your own token on all of your sites and shops. With our payment system, no swaps or exchanges are needed. ',
    shape: <SPLTokenShapeIcon />,
    isLeft: true,
    topSpacing: 'sm',
  },
  {
    title: 'Evolution',
    desc: 'Provide value by letting your NFTs transform with an evolution mechanism: ALL Tech supports visual traits and metadata changes such as roles.',
    shape: <EvolutionShapeIcon />,
    topSpacing: 'sm',
  },
]

export const ALL_LAUNCH_ADDITIONALS: AdditionalFeature[] = [
  {
    logo: <FreeMintsIcon width={['4rem']} height={['4rem']} />,
    title: 'Free Mints',
    desc: 'Projects who let their NFTs be minted for free, can use ALL Launch for just a small service fee.  Giving their users a high class mint experience.',
  },
  {
    logo: <AntiBotMintIcon width={['4rem']} height={['4rem']} />,
    title: 'Anti-Bot Mint',
    desc: 'Through advanced security features, we ensure that the mint can only be completed by humans. Giving every participant a fair chance.',
  },
  {
    logo: <TrustedEnvironmentIcon width='4rem' height='4rem' />,
    title: 'Trusted Environment',
    desc: 'Mints can be stressful. We provide a seamless and easy mint experience for users to trust. No shady 3rd party sites. Our service is reliable and secure. ',
  },
  {
    logo: <UnverifedMintIcon width={['4rem']} height={['4rem']} />,
    title: 'Unverified Mints',
    desc: 'ALL Launch also provides unverified mints, for projects who want to get off the ground quickly. They are marked as such for users to know the risks. ',
  },
  {
    logo: <MarketingPushIcon width={['4rem']} height={['4rem']} />,
    title: 'Marketing Push',
    desc: 'If mints are provided exclusively in $ALL and $PUFF, we provide an additional marketing push for the project to get it off the ground quickly.',
  },
  {
    logo: <RichProjectInformationIcon width={['4rem']} height={['4rem']} />,
    title: 'Rich Project Information',
    desc: 'ALL Launch features opportunities to add high value information about your project, such as utilities, team, roadmap, social links and more.',
  },
]

export const ALL_COIN_ADDITIONALS: AdditionalFeature[] = [
  {
    logo: <StakingDayIcon width={['4rem']} height={['4rem']} />,
    title: 'Staking from day one',
    desc: 'Provide staking for your NFT project from day one with the ready made technology of ALL Tech and the already listed ALL Coin. Save the ressources for establishing a new token and start focusing on creating services that bring value to the communities.',
  },
  {
    logo: <TokenomicsIcon width={['4rem']} height={['4rem']} />,
    title: 'Ready Made Tokenomics',
    desc: 'The core of $ALL is strong tokenomics. By using ALL Coin projects can focus on their utilities and let the tokenomics be managed by ALL Blue. This frees up ressources and gives projects large and small to create usefull services for their and the combined community.',
  },
  {
    logo: <SolanaIntegrationIcon width='4rem' height='4rem' />,
    title: 'Integrations all over the Solana ecosystem',
    desc: '$ALL already covers all the basics. Listings on major DEX platforms such as Raydium and Orca provide trading and staking opportunities. Lisitings on Coingecko and CoinMarketCap covers the analytics side. And there is still more to come.',
  },
]

export const ALL_STRATEGY_ADDITIONALS: AdditionalFeature[] = [
  {
    logo: <IndustryContactsIcon width={['4rem']} height={['4rem']} />,
    title: 'Industry Contacts',
    desc: 'ALL Blue is a combination of top-notch Solana projects. We know the industry. We provide introductions to potential partners and give you an edge in a competitive market. ',
  },
  {
    logo: <DAOStructureIcon width={['4rem']} height={['4rem']} />,
    title: 'DAO Structure',
    desc: 'NFT = community.  Community needs to come first and they need to be able to act in a structured, decentralised way. We help  setting up a strong dao structure, both in technical and strategic ways. Voting systems and special plaatforms are part of our service as well as communication with DAO leaders and training for them.',
  },
  {
    logo: <LaunchPlanIcon width='4rem' height='4rem' />,
    title: 'Marketing Launch Plan',
    desc: 'NFT launches need hype and hype needs to be created, sustainably. We provide you with the tools needed and give guidence on the content and timeline of your postings. We support you from the first follwer on twitter, to satisfying 100k of them. ',
  },
]

export const ALL_TECH_ADDITIONALS: AdditionalFeature[] = [
  {
    logo: <SalesBotIcon width={['4rem']} height={['4rem']} />,
    title: 'Sales & Listing Bot',
    desc: 'The core of $ALL is strong tokenomics. By using ALL Coin projects can focus on their utilities and let the tokenomics be managed by ALL Blue. This frees up ressources and gives projects large and small to create usefull services for their and the combined community.',
  },
  {
    logo: <BreedingIcon width={['4rem']} height={['4rem']} />,
    title: 'Breeding',
    desc: 'Create a successor collection via breeding. Our breeding platform supports various options to fit your needs.',
  },
  {
    logo: <AirdropIcon width='4rem' height='4rem' />,
    title: 'Airdrop System',
    desc: 'NFT launches need hype and hype needs to be created, sustainably. We provide you with the tools needed and give guidence on the content and timeline of your postings. We support you from the first follwer on twitter, to satisfying 100k of them.',
  },
  {
    logo: <SPLTokenIcon width='4rem' height='4rem' />,
    title: 'SPL Token Payment System',
    desc: 'Integration of your own token on all of your sites and shops. With our payment system, no swaps or exchanges are needed. ',
  },
  {
    logo: <StakingIcon width='4rem' height='4rem' />,
    title: 'Staking for $ALL',
    desc: 'Integrate your Staking solution with $ALL coin and become part of the ALL coin ecosystem. ',
  },
]
