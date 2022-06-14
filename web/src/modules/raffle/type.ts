import { getLotteryByAddress } from './lotteryUtils'

export type RaffleType = Awaited<NonNullable<Awaited<ReturnType<typeof getLotteryByAddress>>>>