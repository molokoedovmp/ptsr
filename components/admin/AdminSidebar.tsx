'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Video,
  UserCheck,
  ClipboardList,
  BarChart3,
  Home,
  Settings,
  LogOut,
  ChevronDown,
  X
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
}

export default function AdminSidebar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Панель управления', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'analytics', label: 'Аналитика', href: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'users', label: 'Пользователи', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { id: 'courses', label: 'Курсы', href: '/admin/courses', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'articles', label: 'Статьи', href: '/admin/articles', icon: <FileText className="w-5 h-5" /> },
    { id: 'article-moderation', label: 'Модерация статей', href: '/admin/articles/moderation', icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'videos', label: 'Видео', href: '/admin/videos', icon: <Video className="w-5 h-5" /> },
    { id: 'psychologists', label: 'Психологи', href: '/admin/psychologists', icon: <UserCheck className="w-5 h-5" /> },
    { id: 'psychologist-applications', label: 'Заявки психологов', href: '/admin/psychologists/applications', icon: <ClipboardList className="w-5 h-5" /> },
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
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-900">{user?.name || 'Администратор'}</p>
                  <p className="text-xs text-slate-500 truncate max-w-[120px]">Панель управления</p>
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
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-6 pt-6 border-t border-slate-200 space-y-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="text-sm font-medium">На главную</span>
              </Link>

              <button
                onClick={() => {
                  setOpen(false)
                  handleSignOut()
                }}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Выйти</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Десктопная панель */}
      <aside className="hidden lg:block bg-white rounded-2xl shadow-lg p-6 sticky top-20 h-fit z-40">
        <div className="mb-6 pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.name || 'Администратор'}
              </p>
              <p className="text-xs text-slate-600 truncate">
                Панель управления
              </p>
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
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-slate-200 space-y-1">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">На главную</span>
          </Link>
          
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
