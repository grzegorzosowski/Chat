import { Box, Typography } from "@mui/material"
import { nickValidation } from "../../features/validations/nickValidation"
import { Condition } from "./Condition"

type NickValidatorProps = {
  nick: string;
}

export default function NickValidator({ nick }: NickValidatorProps) {
  const { hasLengthCorrect, hasWhiteListChars } = nickValidation(nick)
  return (
    <Box sx={{ mb: '10px', border: '1px solid', borderColor: 'gray', borderRadius: '5px', padding: '10px', width: '100%', boxSizing: 'border-box' }}>
      <Typography variant='subtitle1' sx={{ color: 'gray', mb: '10px' }}>Nick requirements:</Typography>
      <Condition value={hasLengthCorrect}>Length 3-20 characters</Condition>
      <Condition value={hasWhiteListChars}>Allowed characters: [ a-zA-Z0-9_ ]</Condition>
    </Box>
  )
}
