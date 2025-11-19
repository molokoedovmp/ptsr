'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import BlockNoteViewer from '@/components/editor/BlockNoteViewer'
import { BookOpen, CheckCircle, Clock, ChevronRight, ChevronLeft, Home } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string | null
  content: string
  videoUrl: string | null
  duration: number | null
  isFree: boolean
  orderIndex: number
  completed?: boolean
}

interface Module {
  id: string
  title: string
  orderIndex: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  slug: string
  enrolled: boolean
}

export default function LearnCoursePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string)
  const viewParam = searchParams.get('view')
  
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [currentModule, setCurrentModule] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [showCompletedOnly, setShowCompletedOnly] = useState(viewParam === 'completed')

  const findInitialLesson = (modulesList: Module[], completedOnly: boolean) => {
    if (!modulesList.length) return null

    if (completedOnly) {
      for (const module of modulesList) {
        for (const lesson of module.lessons) {
          if (lesson.completed) {
            return { module, lesson }
          }
        }
      }
      return null
    }

    for (const module of modulesList) {
      for (const lesson of module.lessons) {
        if (!lesson.completed) {
          return { module, lesson }
        }
      }
    }

    const firstModule = modulesList[0]
    if (firstModule && firstModule.lessons.length > 0) {
      return { module: firstModule, lesson: firstModule.lessons[0] }
    }

    return null
  }

  const getVisibleLessons = (module: Module, completedOnly = showCompletedOnly) => {
    return completedOnly
      ? module.lessons.filter((lesson) => lesson.completed)
      : module.lessons
  }

  const hasVisibleLessons = modules.some((module) => getVisibleLessons(module).length > 0)

  const updateLessonView = (completedOnly: boolean) => {
    if (completedOnly === showCompletedOnly) return
    const paramsCopy = new URLSearchParams(searchParams.toString())
    if (completedOnly) {
      paramsCopy.set('view', 'completed')
    } else {
      paramsCopy.delete('view')
    }
    const queryString = paramsCopy.toString()
    router.replace(`/learn/${slug}${queryString ? `?${queryString}` : ''}`)
    setShowCompletedOnly(completedOnly)
  }

  const findAdjacentLesson = (direction: 'next' | 'prev') => {
    if (!currentModule || !currentLesson) return null

    const moduleIndex = modules.findIndex((m) => m.id === currentModule.id)
    if (moduleIndex === -1) return null

    const visibleLessons = getVisibleLessons(currentModule)
    const currentLessonIndex = visibleLessons.findIndex((lesson) => lesson.id === currentLesson.id)

    if (currentLessonIndex !== -1) {
      if (direction === 'next' && currentLessonIndex < visibleLessons.length - 1) {
        return { module: currentModule, lesson: visibleLessons[currentLessonIndex + 1] }
      }
      if (direction === 'prev' && currentLessonIndex > 0) {
        return { module: currentModule, lesson: visibleLessons[currentLessonIndex - 1] }
      }
    }

    if (direction === 'next') {
      for (let i = moduleIndex + 1; i < modules.length; i++) {
        const lessons = getVisibleLessons(modules[i])
        if (lessons.length > 0) {
          return { module: modules[i], lesson: lessons[0] }
        }
      }
    } else {
      for (let i = moduleIndex - 1; i >= 0; i--) {
        const lessons = getVisibleLessons(modules[i])
        if (lessons.length > 0) {
          return { module: modules[i], lesson: lessons[lessons.length - 1] }
        }
      }
    }

    return null
  }

  useEffect(() => {
    setShowCompletedOnly(viewParam === 'completed')
  }, [viewParam])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
    } else if (status === 'authenticated') {
      fetchCourseData()
    }
  }, [status, params.slug])

  useEffect(() => {
    if (!modules.length) return

    if (showCompletedOnly) {
      if (!currentLesson || !currentLesson.completed) {
        const selection = findInitialLesson(modules, true)
        setCurrentModule(selection?.module || null)
        setCurrentLesson(selection?.lesson || null)
      }
    } else if (!currentLesson) {
      const selection = findInitialLesson(modules, false)
      setCurrentModule(selection?.module || null)
      setCurrentLesson(selection?.lesson || null)
    }
  }, [showCompletedOnly, modules, currentLesson])

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`/api/learn/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data.course)
        setModules(data.modules)

        const selection = findInitialLesson(data.modules, viewParam === 'completed')
        setCurrentModule(selection?.module || null)
        setCurrentLesson(selection?.lesson || null)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLessonComplete = async () => {
    if (!currentLesson || completing) return

    setCompleting(true)
    try {
      const response = await fetch(`/api/learn/lessons/${currentLesson.id}/complete`, {
        method: 'POST',
      })

      if (response.ok) {
        // Обновляем статус урока
        setModules(modules.map(m => ({
          ...m,
          lessons: m.lessons.map(l =>
            l.id === currentLesson.id ? { ...l, completed: true } : l
          ),
        })))
        
        if (currentLesson) {
          setCurrentLesson({ ...currentLesson, completed: true })
        }

        // Переходим к следующему уроку
        goToNextLesson()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setCompleting(false)
    }
  }

  const goToNextLesson = () => {
    const target = findAdjacentLesson('next')
    if (target) {
      setCurrentModule(target.module)
      setCurrentLesson(target.lesson)
    }
  }

  const goToPrevLesson = () => {
    const target = findAdjacentLesson('prev')
    if (target) {
      setCurrentModule(target.module)
      setCurrentLesson(target.lesson)
    }
  }

  const selectLesson = (module: Module, lesson: Lesson) => {
    setCurrentModule(module)
    setCurrentLesson(lesson)
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-teal"></div>
      </div>
    )
  }

  if (!course?.enrolled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Доступ закрыт</h2>
          <p className="text-gray-600 mb-6">Вы не записаны на этот курс</p>
          <Link href={`/programs/${params.slug}`} className="btn-primary">
            Перейти к курсу
          </Link>
        </div>
      </div>
    )
  }

  const canGoPrev = Boolean(findAdjacentLesson('prev'))
  const canGoNext = Boolean(findAdjacentLesson('next'))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar с модулями и уроками */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <Link href="/my-courses" className="inline-flex items-center text-brand-teal hover:text-brand-teal/80 mb-4">
            <Home className="w-4 h-4 mr-2" />
            Мои курсы
          </Link>
          <h2 className="text-xl font-bold text-gray-900">{course?.title}</h2>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => updateLessonView(false)}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                showCompletedOnly
                  ? 'border-slate-200 text-slate-500 hover:border-slate-300'
                  : 'border-transparent bg-brand-teal/10 text-brand-teal'
              }`}
            >
              Все уроки
            </button>
            <button
              onClick={() => updateLessonView(true)}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                showCompletedOnly
                  ? 'border-transparent bg-emerald-50 text-emerald-600'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              Пройденные
            </button>
          </div>
        </div>

        <div className="p-4">
          {modules.map((module) => {
            const lessonsToShow = getVisibleLessons(module)
            if (showCompletedOnly && lessonsToShow.length === 0) {
              return null
            }

            return (
              <div key={module.id} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 px-2">
                  {module.title}
                </h3>
                <div className="space-y-1">
                  {lessonsToShow.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => selectLesson(module, lesson)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentLesson?.id === lesson.id
                          ? 'bg-brand-teal text-white'
                          : lesson.completed
                          ? 'bg-green-50 text-green-800 hover:bg-green-100'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex-1">{lesson.title}</span>
                        {lesson.completed && (
                          <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                        )}
                      </div>
                      {lesson.duration && (
                        <div className={`text-xs mt-1 flex items-center ${
                          currentLesson?.id === lesson.id ? 'text-teal-100' : 'text-gray-500'
                        }`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {lesson.duration} мин
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}

          {showCompletedOnly && !hasVisibleLessons && (
            <p className="text-sm text-gray-500 px-2">
              Здесь появятся уроки после завершения.
            </p>
          )}
        </div>
      </div>

      {/* Контент урока */}
      <div className="flex-1 overflow-y-auto">
        {currentLesson ? (
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {currentLesson.title}
              </h1>
              {currentLesson.description && (
                <p className="text-xl text-gray-600">{currentLesson.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-4">
                {currentLesson.duration && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    {currentLesson.duration} минут
                  </div>
                )}
                {currentLesson.completed && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Урок завершен
                  </div>
                )}
              </div>
            </div>

            {/* Видео */}
            {currentLesson.videoUrl && (
              <div className="mb-8">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <iframe
                    src={currentLesson.videoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Контент урока */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <BlockNoteViewer content={currentLesson.content} />
            </div>

            {/* Навигация */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-6">
              <button
                onClick={goToPrevLesson}
                className="flex items-center text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canGoPrev}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Предыдущий урок
              </button>

              {!currentLesson.completed ? (
                <button
                  onClick={handleLessonComplete}
                  disabled={completing}
                  className="btn-primary disabled:opacity-50"
                >
                  {completing ? 'Сохранение...' : 'Завершить урок'}
                </button>
              ) : (
                <button
                  onClick={goToNextLesson}
                  className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!canGoNext}
                >
                  Следующий урок
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {showCompletedOnly ? 'Нет завершённых уроков' : 'Выберите урок'}
              </h2>
              <p className="text-gray-600">
                {showCompletedOnly
                  ? 'Как только уроки будут отмечены завершёнными, вы сможете пересматривать их здесь.'
                  : 'Выберите урок из списка слева для начала обучения'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
