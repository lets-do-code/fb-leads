import transporter from '../config/nodeMailer';

interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const sendMail = async ({ from, to, subject, text, html }: MailOptions) => {
  const mailOptions = {
    from: from || 'sushilkc2611@gmail.com',
    to,
    subject,
    text,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    return 'Email sent successfully';
  } catch (error) {
    if (error && error instanceof Error) {
      return error.message;
    }
  }
};

export default sendMail;
