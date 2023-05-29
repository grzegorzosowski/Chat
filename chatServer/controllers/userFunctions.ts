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
