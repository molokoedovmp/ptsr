"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

// Генерация уникального ID сессии
function getSessionId() {
  if (typeof window === 'undefined') return null
  
  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

// Получение геолокации (используем бесплатный API)
async function getGeolocation() {
  try {
    const response = await fetch('https://ipapi.co/json/')
    if (response.ok) {
      const data = await response.json()
      return {
        country: data.country_name,
        countryCode: data.country_code,
        city: data.city,
        region: data.region,
      }
    }
  } catch (error) {
    console.error('Error fetching geolocation:', error)
  }
  return null
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const pageTitleMap: Record<string, string> = {
    '/': 'Главная',
    '/specialists': 'Список специалистов',
    '/programs': 'Программы',
    '/resources': 'Библиотека ресурсов',
    '/contact': 'Контакты',
    '/profile': 'Личный кабинет',
    '/diary': 'Дневник активности',
    '/mood-diary': 'Дневник настроения',
    '/analytics': 'Моя аналитика',
  }
  const startTimeRef = useRef<number>(Date.now())
  const previousPathRef = useRef<string>("")
  const previousTitleRef = useRef<string>("")

  useEffect(() => {
    let cancelled = false

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const readTitleFromDom = () => {
      const heading = document.querySelector('main h1, h1')
      const headingText = heading?.textContent?.replace(/\s+/g, ' ').trim()
      if (headingText && headingText.length > 1) return headingText

      const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null
      const ogText = ogTitle?.content?.trim()
      if (ogText && ogText.length > 0) return ogText

      return null
    }

    const resolvePageTitle = async (path: string) => {
      const mapped = pageTitleMap[path]
      if (mapped) return mapped

      let dynamicTitle = readTitleFromDom()
      if (dynamicTitle) return dynamicTitle

      for (let attempt = 0; attempt < 5; attempt++) {
        await wait(200)
        dynamicTitle = readTitleFromDom()
        if (dynamicTitle) return dynamicTitle
      }

      return document.title
    }

    const pageTitlePromise = resolvePageTitle(pathname)

    const trackPageView = async () => {
      const sessionId = getSessionId()
      if (!sessionId) return

      const pageTitle = await pageTitlePromise
      if (cancelled) return

      // Отправляем данные о предыдущей странице с временем пребывания
      if (previousPathRef.current) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
        const prevTitle =
          previousTitleRef.current || pageTitleMap[previousPathRef.current] || previousPathRef.current

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            pagePath: previousPathRef.current,
            pageTitle: prevTitle,
            referrer: document.referrer,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            duration,
          }),
        }).catch(err => console.error('Analytics tracking error:', err))
      }

      // Обновляем текущую страницу
      startTimeRef.current = Date.now()
      previousPathRef.current = pathname
      previousTitleRef.current = pageTitle

      // Получаем геолокацию асинхронно (только для первой страницы)
      if (!sessionStorage.getItem('geo_fetched')) {
        sessionStorage.setItem('geo_fetched', 'true')
        const geo = await getGeolocation()

        if (geo) {
          await fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              pagePath: pathname,
              pageTitle,
              referrer: document.referrer,
              ...geo,
              screenWidth: window.screen.width,
              screenHeight: window.screen.height,
              language: navigator.language,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }),
          }).catch(err => console.error('Analytics tracking error:', err))
        }
      }
    }

    const logUserActivity = async () => {
      if (!session?.user) return
      const pageTitle = await pageTitlePromise
      if (cancelled) return
      try {
        await fetch('/api/user/activity-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'PAGE_VIEW',
            metadata: {
              path: pathname,
              title: pageTitle,
            },
          }),
        })
      } catch (error) {
        console.error('Activity log error:', error)
      }
    }

    trackPageView()
    logUserActivity()

    // Отправляем данные при закрытии страницы
    const handleBeforeUnload = () => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const sessionId = getSessionId()
      
      if (sessionId && pathname) {
        navigator.sendBeacon('/api/analytics/track', JSON.stringify({
          sessionId,
          pagePath: pathname,
          pageTitle: previousTitleRef.current || document.title,
          duration,
        }))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      cancelled = true
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [pathname, session?.user])

  return null
}
