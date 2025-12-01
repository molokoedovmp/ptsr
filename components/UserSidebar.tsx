'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  BookOpen,
  Award,
  FileText,
  Heart,
  Settings,
  LogOut,
  BarChart3,
  User,
  Bookmark,
  ChevronDown,
  X,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
}

export default function UserSidebar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navItems: NavItem[] = [
    { id: 'analytics', label: 'Аналитика', href: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'profile', label: 'Профиль', href: '/profile', icon: <User className="w-5 h-5" /> },
    { id: 'courses', label: 'Мои курсы', href: '/my-courses', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'diary', label: 'Дневник', href: '/diary', icon: <FileText className="w-5 h-5" /> },
    { id: 'mood', label: 'Дневник настроения', href: '/mood-diary', icon: <Heart className="w-5 h-5" /> },
    { id: 'certificates', label: 'Сертификаты', href: '/certificates', icon: <Award className="w-5 h-5" /> },
    { id: 'tests', label: 'Результаты тестов', href: '/profile/tests', icon: <FileText className="w-5 h-5" /> },
    { id: 'saved', label: 'Сохранённые статьи', href: '/profile/saved', icon: <Bookmark className="w-5 h-5" /> },
    { id: 'settings', label: 'Настройки', href: '/settings', icon: <Settings className="w-5 h-5" /> },
  ]

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="w-full lg:w-64 lg:flex-shrink-0">
      {/* Кнопка для мобилки */}
      <div className="lg:hidden flex mb-4">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 bg-white shadow-sm hover:bg-slate-50"
        >
          <Settings className="w-4 h-4" />
          Меню
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Мобильное всплывающее меню */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[82vw] max-w-xs bg-white shadow-2xl p-6 rounded-r-3xl overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-teal rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-900">{user?.name || 'Пользователь'}</p>
                  <p className="text-xs text-slate-500 truncate max-w-[120px]">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
                aria-label="Закрыть меню"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 border border-slate-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={() => {
                  setOpen(false)
                  handleSignOut()
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Выйти</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Десктопная панель */}
      <aside className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-20 h-fit">
        <div className="mb-6 pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Пользователь'}</p>
              <p className="text-xs text-slate-600 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 border border-slate-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Выйти</span>
          </button>
        </div>
      </aside>
    </div>
  )
}
