import mail, * as mailer from '@sendgrid/mail'

const sgMail = require('@sendgrid/mail')

mailer.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendMail(args: mail.MailDataRequired) {
  const res = await mailer.send(args)

  console.log('mailRes', res)
}
