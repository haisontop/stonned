import { LaunchModel } from '../components/LaunchCard'

export const MOCK_FEATURED_LAUNCH: LaunchModel = {
  id: '1',
  projectName: 'Collection Name',
  imageURL: '/images/launch/main-collection.png',
  creator: {
    name: 'Creators Name',
    avatarURL: '',
    isAwarded: true
  },
  price: {
    value: '1',
    currency: 'SOL',
  },
  mintDate: '03/04/2022',
  launchType: 'verified',
  supply: '10.000',
  xyzScore: '98',
  remainedItems: '5.237',
}

export const MOCK_LAUNCHES: LaunchModel[] = [
  {
    id: '2',
    projectName: 'Stoned Ape Crew',
    imageURL: '/images/launch/main-collection.png',
    creator: {
      name: 'Creators Name',
      avatarURL: '',
      isAwarded: true,
    },
    price: {
      value: '1',
      currency: 'SOL',
    },
    mintDate: '03/04/2022',
    launchType: 'verified',
    supply: '10.000',
    xyzScore: '98',
    remainedItems: '5.237',
    sold: true,
  },
  {
    id: '3',
    projectName: 'Yaku Engineering',
    imageURL: '/images/launch/main-collection.png',
    creator: {
      name: 'Creators Name',
      avatarURL: '',
    },
    price: {
      value: '1',
      currency: 'SOL',
    },
    mintDate: '03/04/2022',
    launchType: 'verified',
    supply: '10.000',
    xyzScore: '98',
    remainedItems: '5.237',
  },
  {
    id: '4',
    projectName: 'DeGods',
    imageURL: '/images/launch/main-collection.png',
    creator: {
      name: 'Creators Name',
      avatarURL: '',
    },
    price: {
      value: '1',
      currency: 'SOL',
    },
    mintDate: '03/04/2022',
    launchType: 'verified',
    supply: '10.000',
    xyzScore: '98',
    remainedItems: '9.367',
  },
  {
    id: '5',
    projectName: '6 Rings',
    imageURL: '/images/launch/main-collection.png',
    creator: {
      name: 'Creators Name',
      avatarURL: '',
    },
    price: {
      value: '1',
      currency: 'SOL',
    },
    mintDate: '03/04/2022',
    launchType: 'unverified',
    supply: '10.000',
    xyzScore: '98',
    remainedItems: '7.503',
  },
]
