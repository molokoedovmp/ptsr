'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  User, 
  BookOpen, 
  Award, 
  FileText, 
  Heart, 
  Settings,
  LogOut,
  Home,
  BarChart3
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

  const navItems: NavItem[] = [
    { id: 'profile', label: 'Профиль', href: '/profile', icon: <User className="w-5 h-5" /> },
    { id: 'courses', label: 'Мои курсы', href: '/my-courses', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'analytics', label: 'Аналитика', href: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'diary', label: 'Дневник', href: '/diary', icon: <FileText className="w-5 h-5" /> },
    { id: 'mood', label: 'Дневник настроения', href: '/mood-diary', icon: <Heart className="w-5 h-5" /> },
    { id: 'certificates', label: 'Сертификаты', href: '/certificates', icon: <Award className="w-5 h-5" /> },
    { id: 'settings', label: 'Настройки', href: '/settings', icon: <Settings className="w-5 h-5" /> },
  ]

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="w-64 bg-white rounded-2xl shadow-lg p-6 sticky top-20 h-fit z-40">
      {/* Профиль пользователя */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0">
            {user?.image ? (
              <img src={user.image} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user?.name || 'Пользователь'}
            </p>
            <p className="text-xs text-slate-600 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <nav className="space-y-1">
        <Link
          href="/"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-sm font-medium">На главную</span>
        </Link>

        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-brand-teal text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Кнопка выхода */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Выйти</span>
        </button>
      </div>
    </div>
  )
}

