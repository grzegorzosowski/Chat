import passwordValidation from '../../features/passwordValidation/passwordValidation';

describe('Password validation', () => {
    it('passwordValidation returns true for a valid password', () => {
        const password = 'Password1!';
        const result = passwordValidation(password);
        expect(result).toEqual([true, true, true, true, true, true]);
    });

    it('passwordValidation returns false for an invalid password', () => {
        const password = 'password';
        const result = passwordValidation(password);
        expect(result).not.toEqual([true, true, true, true, true, true]);
    });
});
