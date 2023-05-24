export function isNickValid(nick: string | undefined) {
    const allowedCharsRegex = /^[a-zA-Z0-9_]+$/;
    if (nick === undefined) {
        return false;
    }
    if (allowedCharsRegex.test(nick)) {
        return true;
    }
    return false;
}

export function nickValidation(nick: string) {
    const hasLengthCorrect = nick.length > 2 && nick.length < 21;
    const hasWhiteListChars = isNickValid(nick);

    return { hasLengthCorrect, hasWhiteListChars };
}
