import { Box, Typography } from '@mui/material'
import React from 'react'

export const FOOTER_HEIGHT = 64;

export default function Footer() {
    return (
        <Box sx={(theme) => ({
            minHeight: `${FOOTER_HEIGHT}px`,
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText
        })}>
            <Typography variant="h6" align="center" gutterBottom>
                Chat App
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
                {"© "}
                {new Date().getFullYear()}
            </Typography>
        </Box>
    )
}
