'use client'

import Link from 'next/link'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-slate-300 border-t border-slate-800">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О проекте */}
          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-4">ПТСР Эксперт</h3>
            <p className="text-sm mb-4">
              Профессиональная платформа поддержки людей с посттравматическим стрессовым расстройством
            </p>
            
          </div>

          {/* Основные разделы */}
          <div>
            <h4 className="text-white font-semibold mb-4">Основные разделы</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-brand-teal transition-colors">Главная</Link></li>
              <li><Link href="/specialists" className="hover:text-brand-teal transition-colors">Специалисты</Link></li>
              <li><Link href="/programs" className="hover:text-brand-teal transition-colors">Программы</Link></li>
              <li><Link href="/resources" className="hover:text-brand-teal transition-colors">Ресурсы</Link></li>
              <li><Link href="/contact" className="hover:text-brand-teal transition-colors">Контакты</Link></li>
            </ul>
          </div>

          {/* Дополнительно */}
          <div>
            <h4 className="text-white font-semibold mb-4">Дополнительно</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/support" className="hover:text-brand-teal transition-colors">Техподдержка</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-brand-teal transition-colors">Политика конфиденциальности</Link></li>
              <li><Link href="/spiritual-support" className="hover:text-brand-teal transition-colors">Духовная поддержка</Link></li>
              <li><Link href="/donate" className="hover:text-brand-teal transition-colors">Поддержать проект</Link></li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="text-white font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-teal" />
                <a href="mailto:support@ptsr-expert.ru" className="hover:text-brand-teal transition-colors">
                  support@ptsr-expert.ru
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-teal" />
                <a href="tel:+78001234567" className="hover:text-brand-teal transition-colors">
                  8 (800) 123-45-67
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-brand-teal" />
                <span>Москва, Россия</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
          <p className="text-slate-400">&copy; {new Date().getFullYear()} ПТСР Эксперт. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

