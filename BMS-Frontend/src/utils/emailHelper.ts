import nodemailer from "nodemailer"

type EmailPayload = {
  to: string
  subject: string
  html: string
}

// Replace with your SMTP credentials
//test stmp box soo no need to add it in vault
var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
      user: "4b43bffc027ec6",
      pass: "894ed5af19e1e0"
    },
    tls: {
        ciphers:'SSLv3'
    }
  });

export const sendEmail = async (data: EmailPayload) => {
//   const transporter = nodemailer.createTransport({
//     ...transport,
//   })

  return await transport.sendMail({
    from: 'from@example.com',
    ...data,
  })
}