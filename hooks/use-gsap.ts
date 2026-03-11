"use client"

import { useEffect, useRef } from "react"

/**
 * Scroll reveal using IntersectionObserver (CSS-driven, no GSAP dependency).
 * Elements start visible by default and get a smooth entrance animation when scrolled into view.
 * This approach never leaves content invisible if JS fails.
 */
export function useScrollReveal<T extends HTMLElement>(
  options?: {
    y?: number
    duration?: number
    delay?: number
    start?: string
  }
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Set initial hidden state via inline styles
    const y = options?.y ?? 40
    const duration = options?.duration ?? 0.7
    const delay = options?.delay ?? 0

    el.style.opacity = "0"
    el.style.transform = `translateY(${y}px)`
    el.style.transition = `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1"
            el.style.transform = "translateY(0px)"
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      // Reset to visible on cleanup so content is never hidden
      el.style.opacity = "1"
      el.style.transform = "translateY(0px)"
    }
  }, [options?.y, options?.duration, options?.delay])

  return ref
}

/**
 * Staggered children reveal using IntersectionObserver.
 */
export function useStaggerReveal<T extends HTMLElement>(
  childSelector: string,
  options?: {
    y?: number
    duration?: number
    stagger?: number
    start?: string
  }
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const children = el.querySelectorAll(childSelector) as NodeListOf<HTMLElement>
    if (children.length === 0) return

    const y = options?.y ?? 30
    const duration = options?.duration ?? 0.6
    const stagger = options?.stagger ?? 0.08

    // Set initial hidden state on each child
    children.forEach((child, i) => {
      child.style.opacity = "0"
      child.style.transform = `translateY(${y}px)`
      child.style.transition = `opacity ${duration}s ease-out ${i * stagger}s, transform ${duration}s ease-out ${i * stagger}s`
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            children.forEach((child) => {
              child.style.opacity = "1"
              child.style.transform = "translateY(0px)"
            })
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      // Reset to visible on cleanup
      children.forEach((child) => {
        child.style.opacity = "1"
        child.style.transform = "translateY(0px)"
      })
    }
  }, [childSelector, options?.y, options?.duration, options?.stagger])

  return ref
}
