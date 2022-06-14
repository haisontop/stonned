import { differenceInSeconds } from 'date-fns'
import { useState } from 'react'
import { useInterval } from 'react-use'

export default function useCountdown(endDate: Date) {
  const [countdown, setCountdown] = useState(getCountdown(endDate))

  useInterval(() => {
    setCountdown(getCountdown(endDate))
  }, 1000)

  return countdown
}

function getCountdown(endDate: Date) {
  const wholeSeconds = differenceInSeconds(endDate, new Date())

  if (wholeSeconds < 0)
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      completed: true,
    }

  const hours = Math.floor(wholeSeconds / 3600)
  const minutes = Math.floor((wholeSeconds - hours * 3600) / 60)
  const seconds = Math.floor(wholeSeconds - (hours * 3600 + minutes * 60))

  return {
    hours,
    minutes,
    seconds,
    completed: false,
  }
}

export function printCountdownNumber() {}