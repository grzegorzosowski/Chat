import React from 'react'
import { useUser } from '../../UserProvider';
import { Box, Typography } from '@mui/material';

export default function ProfileInfo() {
    const user = useUser();
    const isUser = !!user;
    console.log("email verifivation: ", user?.verified)
    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
        }}>
            <Typography variant='h6' sx={{ margin: '10px 0' }}>Your email: {user?.email}</Typography>
            <Typography variant='subtitle1' sx={{ margin: '10px 0' }}>Your email is: {user?.verified === true ? 'verified' : 'not verified'}</Typography>
        </Box>
    )
}
