import { Box, Button } from '@mui/material'
import { useEffect, useState } from 'react';
import InputPassword from '../InputPassword';
import PassValidator from '../validators/PassValidator';
import { enqueueSnackbar } from 'notistack';
import { useResetPasswordMutation } from '../../features/api/apiSlice';

type FormState = {
    oldPassword: string;
    newPassword: string;
    repeatedPassword: string;
}

type ResponseError = {
    status: number,
    data: {
        message: string
    }
}

export default function ChangePassword() {
    const [validationDone, setValidationDone] = useState(false);
    const [form, setForm] = useState<FormState>({ oldPassword: '', newPassword: '', repeatedPassword: '' });
    const [resetUserPassword, { isLoading }] = useResetPasswordMutation();
    const [changeIdentifier, setChangeIdentifier] = useState('');

    useEffect(() => {
        setForm({ oldPassword: '', newPassword: '', repeatedPassword: '' })
    }, [changeIdentifier]);

    const resetPassword = async () => {
        await resetUserPassword({
            oldPassword: form.oldPassword,
            newPassword: form.newPassword
        })
            .unwrap()
            .then(() => {
                enqueueSnackbar('Password has been changed', { variant: 'success' })

                setChangeIdentifier(Date.now().toString());
            })
            .catch((error: ResponseError) => {
                console.log("error: ", error)
                enqueueSnackbar(error.data.message, { variant: 'error' })
            })
    }

    const handleSubmit = (event: React.FormEvent<Element>) => {
        event.preventDefault();
        if (!validationDone) {
            enqueueSnackbar('Password is not valid', { variant: 'error' });
        } else if (form.newPassword !== form.repeatedPassword && validationDone) {
            enqueueSnackbar('Passwords are not the same', { variant: 'error' });
        } else {
            void resetPassword();
        }
    }



    return (
        <Box key={changeIdentifier} sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',


        }}>
            <Box component='form' onSubmit={handleSubmit} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '500px',
                height: '100%',
                boxSizing: 'border-box',
                padding: '10px',
            }}>
                <InputPassword
                    id='oldPassword'
                    value={form.oldPassword}
                    onChange={(event) => setForm({ ...form, oldPassword: event.target.value })}
                    text={'Old Password'}
                ></InputPassword>
                <InputPassword
                    id='newPassword'
                    value={form.newPassword}
                    onChange={(event) => setForm({ ...form, newPassword: event.target.value })}
                    text={'New Password'}
                ></InputPassword>
                <InputPassword
                    id='repeatedPassword'
                    value={form.repeatedPassword}
                    onChange={(event) => setForm({ ...form, repeatedPassword: event.target.value })}
                    text={'Repeat Password'}
                ></InputPassword>
                <PassValidator password={form.newPassword} passwordCorrect={setValidationDone}></PassValidator>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isLoading}
                    sx={{ px: 5, mt: 1 }}
                >
                    CHANGE
                </Button>
            </Box>
        </Box>
    )
}
