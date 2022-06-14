import { As } from '@chakra-ui/system'

export interface MainFeature {
  title: string
  desc: string
  shape?: JSX.Element
  isLeft?: boolean
  topSpacing?: "sm" | "md" | "lg"
}

export interface AdditionalFeature {
  title: string
  logo: JSX.Element
  desc: string
}

export enum CategoryLabel {
  Launch = 'Launch',
  Strategy = 'Strategy',
  Tech = 'Tech',
  Coin = 'Coin',
}

export interface CategoryOverview {
  categoryLabel: CategoryLabel
  logo: JSX.Element
  desc: string
  color: string
}
