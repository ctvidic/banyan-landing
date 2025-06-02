"use client"

import { useEffect, useRef, useState } from 'react'

interface OptimizedVideoProps {
  src: string
  poster?: string
  className?: string
}

export default function OptimizedVideo({ src, poster, className }: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay={isInView}
      loop
      muted
      playsInline
      preload="none"
      poster={poster}
    >
      {isInView && <source src={src} type="video/mp4" />}
    </video>
  )
} 