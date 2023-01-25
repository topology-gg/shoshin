import { useEffect, useState, useCallback } from 'react'

// source: https://stackoverflow.com/a/59989768

export const useResize = (myRef) => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    const handleResize = useCallback(() => {
        setWidth(myRef.current.offsetWidth)
        setHeight(myRef.current.offsetHeight)
    }, [myRef])

    useEffect(() => {
      window.addEventListener('load', handleResize)
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('load', handleResize)
        window.removeEventListener('resize', handleResize)
      }
    }, [])
    // }, [myRef, handleResize])

    return { width, height }
}