export interface Product {
  id: string
  logo: JSX.Element
  desc: string
  tags: string[]
  bg: string
  comingSoon?: boolean
}

export interface Project {
  img: string
  title: string
}
