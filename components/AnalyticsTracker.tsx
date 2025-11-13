'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

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
  const startTimeRef = useRef<number>(Date.now())
  const previousPathRef = useRef<string>('')

  useEffect(() => {
    const trackPageView = async () => {
      const sessionId = getSessionId()
      if (!sessionId) return

      // Отправляем данные о предыдущей странице с временем пребывания
      if (previousPathRef.current) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
        
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            pagePath: previousPathRef.current,
            pageTitle: document.title,
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
              pageTitle: document.title,
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

    trackPageView()

    // Отправляем данные при закрытии страницы
    const handleBeforeUnload = () => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const sessionId = getSessionId()
      
      if (sessionId && pathname) {
        navigator.sendBeacon('/api/analytics/track', JSON.stringify({
          sessionId,
          pagePath: pathname,
          pageTitle: document.title,
          duration,
        }))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [pathname])

  return null
}

