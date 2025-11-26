import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsBreakpoint(breakpoint: number = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    checkBreakpoint()
    window.addEventListener('resize', checkBreakpoint)

    return () => window.removeEventListener('resize', checkBreakpoint)
  }, [breakpoint])

  return isMobile
}
