import { Box, Typography } from '@mui/material'
import LoadingCircle from './LoadingCircle'

export default function Siemanko() {
    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Box sx={{
                width: '400px',
                textAlign: 'center'
            }}>
                <Typography>Be patient, loading our app...</Typography>
            </Box>
            <Box sx={{
                width: '400px',
                height: '200px',
                position: 'relative'
            }}>
                <LoadingCircle />
            </Box>
        </Box>
    )
}
