import { AllCoinColoredIcon } from '../../landing/components/icons/AllCoinColoredIcon'
import { AllLaunchColoredIcon } from '../../landing/components/icons/AllLaunchColoredIcon'
import { AllStrategyColoredIcon } from '../../landing/components/icons/AllStrategyColoredIcon'
import { AllTechColoredIcon } from '../../landing/components/icons/AllTechColoredIcon'
import { CategoryLabel, CategoryOverview } from '../types'

export const INFO_CATEGORIES: CategoryOverview[] = [
  {
    categoryLabel: CategoryLabel.Launch,
    logo: <AllLaunchColoredIcon />,
    desc: 'Projects who let their NFTs be minted for free, can use ALL Launch for just a small service fee.  Giving their users a high class mint experience.',
    color: '#ED6749',
  },
  {
    categoryLabel: CategoryLabel.Strategy,
    logo: <AllStrategyColoredIcon />,
    desc: 'Projects who let their NFTs be minted for free, can use ALL Launch for just a small service fee.  Giving their users a high class mint experience.',
    color: '#1399D9',
  },
  {
    categoryLabel: CategoryLabel.Tech,
    logo: <AllTechColoredIcon />,
    desc: 'Projects who let their NFTs be minted for free, can use ALL Launch for just a small service fee.  Giving their users a high class mint experience.',
    color: '#DC1670',
  },
  {
    categoryLabel: CategoryLabel.Coin,
    logo: <AllCoinColoredIcon />,
    desc: 'Projects who let their NFTs be minted for free, can use ALL Launch for just a small service fee.  Giving their users a high class mint experience.',
    color: '#820FB8',
  },
]
