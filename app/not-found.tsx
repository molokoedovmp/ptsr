'use client'

import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Иллюстрация */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-16 h-16 text-primary-600" />
          </div>
        </div>

        {/* Текст */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Страница не найдена
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          К сожалению, запрашиваемая вами страница не существует или была перемещена. 
          Проверьте правильность адреса или вернитесь на главную страницу.
        </p>

        {/* Действия */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn-primary inline-flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>На главную</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад</span>
          </button>
        </div>

        {/* Полезные ссылки */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Возможно, вас заинтересует:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/specialists"
              className="card hover:shadow-xl transition-shadow text-center"
            >
              <h4 className="font-semibold text-gray-900 mb-1">Специалисты</h4>
              <p className="text-sm text-gray-600">Найти психолога</p>
            </Link>
            <Link
              href="/programs"
              className="card hover:shadow-xl transition-shadow text-center"
            >
              <h4 className="font-semibold text-gray-900 mb-1">Программы</h4>
              <p className="text-sm text-gray-600">Образовательные курсы</p>
            </Link>
            <Link
              href="/resources"
              className="card hover:shadow-xl transition-shadow text-center"
            >
              <h4 className="font-semibold text-gray-900 mb-1">Ресурсы</h4>
              <p className="text-sm text-gray-600">Статьи и видео</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

