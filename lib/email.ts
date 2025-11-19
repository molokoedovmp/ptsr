import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NEXT_PUBLIC_NODEMAILER_USER,
    pass: process.env.NEXT_PUBLIC_NODEMAILER_PASSWORD,
  },
})

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

  const mailOptions = {
    from: process.env.NEXT_PUBLIC_NODEMAILER_USER,
    to: email,
    subject: 'Подтверждение регистрации - ПТСР Эксперт',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f9d8a;">Добро пожаловать в ПТСР Эксперт!</h1>
        <p>Спасибо за регистрацию. Пожалуйста, подтвердите ваш email адрес, нажав на кнопку ниже:</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #0f9d8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Подтвердить email
        </a>
        <p>Или скопируйте эту ссылку в браузер:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Если вы не регистрировались на нашем сайте, проигнорируйте это письмо.
        </p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendPasswordResetEmail(email: string, token: string, baseUrl?: string) {
  const origin = baseUrl || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin
  const resetUrl = `${normalizedOrigin}/reset-password?token=${token}`

  const mailOptions = {
    from: process.env.NEXT_PUBLIC_NODEMAILER_USER,
    to: email,
    subject: 'Восстановление пароля - ПТСР Эксперт',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f9d8a;">Восстановление пароля</h1>
        <p>Вы запросили восстановление пароля. Нажмите на кнопку ниже, чтобы создать новый пароль:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #0f9d8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Сбросить пароль
        </a>
        <p>Или скопируйте эту ссылку в браузер:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Ссылка действительна в течение 1 часа.<br>
          Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.
        </p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

type ApplicationStatusMail = 'APPROVED' | 'REJECTED' | 'PENDING' | 'ACTIVATED'

export async function sendPsychologistApplicationStatusEmail(email: string, status: ApplicationStatusMail) {
  const statusMessages: Record<ApplicationStatusMail, { title: string; body: string }> = {
    APPROVED: {
      title: 'Ваша заявка одобрена',
      body: 'Администратор подтвердил вашу заявку. В ближайшее время вы получите инструкции по активации рабочего кабинета.',
    },
    REJECTED: {
      title: 'Ваша заявка отклонена',
      body: 'К сожалению, заявка отклонена. При необходимости вы можете связаться с администрацией для уточнения деталей.',
    },
    PENDING: {
      title: 'Заявка находится на рассмотрении',
      body: 'Статус вашей заявки изменён на «На рассмотрении». Мы сообщим, как только будет принято решение.',
    },
    ACTIVATED: {
      title: 'Аккаунт активирован',
      body: 'Спасибо, что присоединились к ПТСР Эксперт. Вы можете войти в кабинет психолога под своим email и новым паролем.',
    },
  }

  const mailOptions = {
    from: process.env.NEXT_PUBLIC_NODEMAILER_USER,
    to: email,
    subject: `Заявка психолога — ${statusMessages[status].title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f9d8a;">${statusMessages[status].title}</h1>
        <p style="color: #475569;">${statusMessages[status].body}</p>
        <p style="color: #475569; margin-top: 24px;">
          Если у вас остались вопросы, напишите нам на support@ptsr-expert.ru
        </p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendPsychologistActivationEmail(email: string, token: string, baseUrl?: string) {
  const origin = baseUrl || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin
  const activationUrl = `${normalizedOrigin}/psychologist/activate?token=${token}`

  const mailOptions = {
    from: process.env.NEXT_PUBLIC_NODEMAILER_USER,
    to: email,
    subject: 'Подтвердите регистрацию психолога',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f9d8a;">Добро пожаловать в ПТСР Эксперт</h1>
        <p>Администратор одобрил вашу заявку. Чтобы активировать рабочий кабинет и установить пароль, нажмите на кнопку ниже:</p>
        <a href="${activationUrl}" style="display: inline-block; background-color: #0f9d8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Активировать аккаунт
        </a>
        <p style="color: #666;">Ссылка действует 7 дней. Если кнопка не работает, скопируйте ссылку в браузер:</p>
        <p style="color: #666; word-break: break-all;">${activationUrl}</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
