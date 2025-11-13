import { Shield, Lock, Eye, FileText } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="section-title">Политика конфиденциальности</h1>
          <p className="text-gray-600">
            Последнее обновление: 12 ноября 2025
          </p>
        </div>

        <div className="card space-y-8">
          {/* Введение */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              Платформа ПТСР Эксперт серьезно относится к защите ваших персональных данных. 
              Эта политика конфиденциальности объясняет, как мы собираем, используем и защищаем 
              вашу информацию.
            </p>
          </section>

          {/* Собираемые данные */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Какие данные мы собираем
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p><strong>Личная информация:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Имя и фамилия</li>
                <li>Адрес электронной почты</li>
                <li>Номер телефона (опционально)</li>
                <li>Данные профиля</li>
              </ul>
              
              <p className="mt-4"><strong>Информация об использовании:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Записи дневника настроения</li>
                <li>Активность на платформе</li>
                <li>Прогресс в программах</li>
                <li>История консультаций</li>
              </ul>

              <p className="mt-4"><strong>Технические данные:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>IP-адрес</li>
                <li>Тип браузера</li>
                <li>Данные cookies</li>
                <li>Информация об устройстве</li>
              </ul>
            </div>
          </section>

          {/* Использование данных */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Как мы используем ваши данные
              </h2>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Предоставление и улучшение наших услуг</li>
              <li>• Обеспечение безопасности платформы</li>
              <li>• Связь с вами по важным вопросам</li>
              <li>• Персонализация вашего опыта</li>
              <li>• Аналитика и улучшение функционала</li>
              <li>• Соблюдение законодательных требований</li>
            </ul>
          </section>

          {/* Защита данных */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Как мы защищаем ваши данные
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Мы применяем современные методы защиты информации:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Шифрование данных при передаче (SSL/TLS)</li>
                <li>Шифрование данных при хранении</li>
                <li>Строгий контроль доступа (Row-Level Security)</li>
                <li>Регулярные аудиты безопасности</li>
                <li>Двухфакторная аутентификация</li>
                <li>Логирование всех действий с данными</li>
              </ul>
            </div>
          </section>

          {/* Передача данных третьим лицам */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Передача данных третьим лицам
            </h2>
            <p className="text-gray-700 mb-3">
              Мы не продаем и не передаем ваши персональные данные третьим лицам, за исключением:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
              <li>Когда это необходимо для предоставления услуг (например, платежные системы)</li>
              <li>По требованию закона или государственных органов</li>
              <li>С вашего явного согласия</li>
            </ul>
          </section>

          {/* Ваши права */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ваши права
            </h2>
            <p className="text-gray-700 mb-3">
              Вы имеете право:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
              <li>Получить доступ к своим данным</li>
              <li>Исправить неточные данные</li>
              <li>Удалить свои данные</li>
              <li>Ограничить обработку данных</li>
              <li>Возразить против обработки</li>
              <li>Получить копию данных</li>
              <li>Отозвать согласие на обработку</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Использование Cookies
            </h2>
            <p className="text-gray-700 mb-3">
              Мы используем cookies для:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
              <li>Обеспечения работы платформы</li>
              <li>Запоминания ваших предпочтений</li>
              <li>Аналитики использования сайта</li>
              <li>Улучшения пользовательского опыта</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Вы можете управлять cookies через настройки вашего браузера.
            </p>
          </section>

          {/* Конфиденциальность в консультациях */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Конфиденциальность консультаций
            </h2>
            <p className="text-gray-700">
              Все консультации с психологами строго конфиденциальны. Мы соблюдаем 
              профессиональную этику и не раскрываем содержание ваших сессий третьим лицам 
              без вашего согласия, за исключением случаев, предусмотренных законом 
              (угроза жизни, судебное предписание).
            </p>
          </section>

          {/* Изменения в политике */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Изменения в политике
            </h2>
            <p className="text-gray-700">
              Мы можем обновлять эту политику конфиденциальности время от времени. 
              О существенных изменениях мы уведомим вас по электронной почте. 
              Дата последнего обновления всегда указана в начале документа.
            </p>
          </section>

          {/* Контакты */}
          <section className="border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Контакты по вопросам конфиденциальности
            </h2>
            <p className="text-gray-700 mb-3">
              Если у вас есть вопросы о нашей политике конфиденциальности, 
              свяжитесь с нами:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@ptsr-expert.ru" className="text-primary-600 hover:text-primary-700">
                  privacy@ptsr-expert.ru
                </a>
              </p>
              <p>
                <strong>Телефон:</strong>{' '}
                <a href="tel:+78001234567" className="text-primary-600 hover:text-primary-700">
                  8 (800) 123-45-67
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

