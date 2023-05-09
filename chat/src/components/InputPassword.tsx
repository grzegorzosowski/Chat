import React from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface InputePasswordProps {
    text?: string
    id?: string
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> | undefined
    name?: string
    value?: string
}

export default function InputPassword({ text, id, onChange, name }: InputePasswordProps) {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault();
    };
    return (
        <FormControl sx={{ width: 1, mb: '10px' }} size="small" variant="outlined" id={id}
            data-testid="password">
            <InputLabel htmlFor="outlined-adornment-password" id={id}  >
                {text}
            </InputLabel>
            <OutlinedInput
                id={id}
                type={showPassword ? 'text' : 'password'}
                onChange={onChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label={text}
                name={name}
            />
        </FormControl>
    );
}