import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'sushilkc2611@gmail.com',
    pass: 'advv ynma aedi zyns'
  }
});

export default transporter;
