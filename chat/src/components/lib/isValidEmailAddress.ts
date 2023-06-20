export const isValidEmailAddress = (emailAddress: string | undefined) => {
    if (emailAddress === undefined) {
        return false;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};
