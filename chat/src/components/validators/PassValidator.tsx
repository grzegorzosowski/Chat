import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import passwordValidation from '../../features/validations/passwordValidation';
import { Condition } from './Condition';

type PassValidatorProps = {
  password: string;
  passwordCorrect: (data: boolean) => void;
};

export default function PassValidator({ password, passwordCorrect }: PassValidatorProps) {
  const [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, hasNoSpaces] = passwordValidation(password);

  const allCorrect = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasNoSpaces;

  useEffect(() => {
    passwordCorrect(allCorrect);
  }, [allCorrect, passwordCorrect]);

  return (
    <Box sx={{ border: '1px solid', borderColor: 'gray', borderRadius: '5px', padding: '10px', width: '100%', boxSizing: 'border-box' }}>
      <Typography variant='subtitle1' sx={{ color: 'gray', mb: '10px' }}>Password requirements:</Typography>
      <Condition value={hasMinLength}>Minimum length 8</Condition>
      <Condition value={hasUpperCase}>Must have uppercase letter</Condition>
      <Condition value={hasLowerCase}>Must have lowercase letter</Condition>
      <Condition value={hasNumber}>Must have number</Condition>
      <Condition value={hasSpecialChar}>Must have special character</Condition>
      <Condition value={hasNoSpaces}>Must have no spaces</Condition>
    </Box>
  );
}

