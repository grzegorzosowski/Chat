import { UserType, UserWithId } from '../db/models/User';
import { getClient } from './smtp';
import { emailTokenGenerator } from './emailToken';

const EMAIL_VERIFICATION_SECRET = process.env.EMAIL_VERIFICATION_SECRET || '';
const MAX_AGE = 60 * 60 * 8; // 8 hours
const EMAIL_FROM = process.env.EMAIL_FROM;
const BASE_URL = process.env.BASE_URL;

export const { generateToken, verifyToken } = emailTokenGenerator(EMAIL_VERIFICATION_SECRET, MAX_AGE);

export async function emailVerify(user: UserWithId) {
    const token = await generateToken(user);
    const verificationUrl = `${BASE_URL}/api/email?token=${token}`;
    const message = `Please click the link below to verify your email address: ${verificationUrl}`;
    const subject = 'Verify your email address';
    const html = `<p>${message}</p>`;
    const text = message;
    const from = EMAIL_FROM || '';
    const to = user.email;

    const transporter = getClient();

    const mailOptions = {
        from,
        to,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
