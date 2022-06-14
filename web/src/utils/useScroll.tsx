import { useEffect, useRef, useState } from 'react'

export const useScroll = () => {
  const timer = useRef<NodeJS.Timeout>()
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 })

  const onScrollChange = () => {
    setScrollPos({ x: window.scrollX, y: window.scrollY })
  }

  useEffect(() => {
    const handleScroll = () => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(onScrollChange, 50)
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return { scrollPos }
}
