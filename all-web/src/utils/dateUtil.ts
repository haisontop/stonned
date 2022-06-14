import { differenceInSeconds } from 'date-fns'

export type CountDown = {
  hours: number
  minutes: number
  seconds: number
  wholeSeconds: number
}

export const getCountDown = (startDate: Date, endDate: Date): CountDown => {
  const wholeSeconds = differenceInSeconds(startDate, endDate)

  const hours = Math.floor(wholeSeconds / 3600)
  const minutes = Math.floor((wholeSeconds - hours * 3600) / 60)
  const seconds = Math.floor(wholeSeconds - (hours * 3600 + minutes * 60))

  return {
    hours,
    minutes,
    seconds,
    wholeSeconds
  }
}
