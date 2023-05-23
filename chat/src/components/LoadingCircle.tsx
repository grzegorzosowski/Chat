import { Box, CircularProgress } from '@mui/material'

export default function LoadingCircle() {
    return (
        <Box sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
        }}>
            <CircularProgress size={50} />
        </Box>
    )
}
