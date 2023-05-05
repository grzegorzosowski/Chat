import { Box, Link, Typography } from '@mui/material'
import React from 'react'
import errorPng from './pngegg.png'
import { useIsMobile } from '../../features/useIsMobile'


export default function ErrorPage() {
    const isMobile = useIsMobile();
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <img src={errorPng} alt="404" width={isMobile ? '80%' : '817'} />
            <Box sx={{
                mt: 3,
            }}>
                <Link
                    href='/'
                    sx={{
                        fontSize: '1.5rem',
                        color: '#1976d2',
                    }}>Go back to home page</Link>
            </Box>
        </Box>
    )
}
