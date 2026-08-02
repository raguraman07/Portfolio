import emailjs from '@emailjs/browser'

interface SendEmailParams {
  name: string
  email: string
  message: string
}

export const sendEmail = async ({ name, email, message }: SendEmailParams) => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('EmailJS configuration is missing in environment variables.')
  }

  return emailjs.send(
    serviceId,
    templateId,
    {
      name,
      email,
      message,
      title: 'New Portfolio Contact Message',
      time: new Date().toLocaleString(),
    },
    publicKey
  )
}
