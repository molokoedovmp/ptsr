'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from 'next-auth/react'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const { user, isAdmin, isSupport, isPsychologist } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const publicLinks = [
    { href: '/', label: 'Главная' },
    { href: '/specialists', label: 'Специалисты' },
    { href: '/programs', label: 'Программы' },
    { href: '/resources', label: 'Ресурсы' },
    { href: '/contact', label: 'Контакты' },
    { href: '/donate', label: 'Поддержать' },
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95 font-heading">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-teal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">П</span>
            </div>
            
              <span>ПТСР-Эксперт</span>
            
          </Link>

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-6">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-brand-teal'
                    : 'text-slate-700 hover:text-brand-teal'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Кнопки авторизации/профиля */}
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link href="/admin/dashboard" className="flex items-center space-x-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Админ</span>
                  </Link>
                )}
                {isSupport && (
                  <Link href="/support/dashboard" className="flex items-center space-x-1 text-sm font-medium text-brand-blue hover:text-brand-blue/80 transition-colors">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Поддержка</span>
                  </Link>
                )}
                {isPsychologist && (
                  <Link href="/psychologist/dashboard" className="flex items-center space-x-1 text-sm font-medium text-brand-teal hover:text-brand-teal/80 transition-colors">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Кабинет психолога</span>
                  </Link>
                )}
                <Link href="/profile" className="flex items-center space-x-1 text-sm font-medium text-slate-700 hover:text-brand-teal">
                  <User className="w-4 h-4" />
                  <span>Профиль</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-sm font-medium text-slate-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Выход</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-brand-teal">
                  Вход
                </Link>
                <Link href="/register" className="bg-brand-teal text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm">
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Мобильное меню кнопка */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium ${
                    pathname === link.href
                      ? 'text-brand-teal'
                      : 'text-slate-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link href="/profile" className="text-sm font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                    Профиль
                  </Link>
                  {isAdmin && (
                    <Link href="/admin/dashboard" className="text-sm font-medium text-purple-600" onClick={() => setMobileMenuOpen(false)}>
                      Админ-панель
                    </Link>
                  )}
                  {isSupport && (
                    <Link href="/support/dashboard" className="text-sm font-medium text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                      Панель поддержки
                    </Link>
                  )}
                  {isPsychologist && (
                    <Link href="/psychologist/dashboard" className="text-sm font-medium text-green-600" onClick={() => setMobileMenuOpen(false)}>
                      Кабинет психолога
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="text-sm font-medium text-red-600 text-left"
                  >
                    Выход
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                    Вход
                  </Link>
                  <Link href="/register" className="text-sm font-medium text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
