import { SerializedUser } from '../authentication';
type SessionWithPassport = Express.Request['session'] & {
    passport?: {
        user?: SerializedUser;
    };
};

export function getUserFromSession(session: Express.Request['session']) {
    const passport = (session as SessionWithPassport).passport;
    return passport?.user;
}

export const normalizeMail = (mail: string) => {
    return mail.toLowerCase().trim();
};

export const isValidEmailAddress = (emailAddress: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};
