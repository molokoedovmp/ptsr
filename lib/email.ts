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

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

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

