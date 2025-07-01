import { useEffect, useState } from 'react'

const SECOND = 1_000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export default function useTimer(minutes: number, interval = SECOND) {
  const [timespan, setTimespan] = useState(new Date().getTime() + minutes * 60000 - Date.now())
  const [isEnded, setIsEnded] = useState(false)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isEnded) clearInterval(intervalId)
      setTimespan((_timespan) => {
        let time = Math.max(_timespan - interval, 0)
        if (time <= 0) {
          setIsEnded(true)
        }
        return time
      })
    }, interval)

    if (isEnded) clearInterval(intervalId)

    return () => {
      clearInterval(intervalId)
    }
  }, [interval, isEnded])

  const restart = () => {
    setTimespan(new Date().getTime() + minutes * 60000 - Date.now())
    setIsEnded(false)
  }

  /* If the initial deadline value changes */
  useEffect(() => {
    restart()
  }, [minutes])

  return {
    days: Math.floor(timespan / DAY),
    hours: Math.floor((timespan / HOUR) % 24),
    minutes: Math.floor((timespan / MINUTE) % 60),
    seconds: Math.floor((timespan / SECOND) % 60),
    restart,
    isEnded,
  }
}
