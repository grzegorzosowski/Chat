import nodemailer from 'nodemailer';

const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

if (!EMAIL_FROM || !EMAIL_HOST || !EMAIL_USER || !EMAIL_PASSWORD) {
    throw new Error('Invalid/Missing environment variable: "EMAIL_FROM", "EMAIL_HOST", "EMAIL_USER", "EMAIL_PASSWORD"');
}

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    },
});

export function getClient(): typeof transporter {
    return transporter;
}
