import { Box, CircularProgress } from '@mui/material'
const CIRCLE_SIZE = 50

export default function LoadingCircle() {
    return (
        <Box sx={{
            position: 'absolute',
            left: `calc(50% - ${CIRCLE_SIZE / 2}px)`,
            top: `calc(50% - ${CIRCLE_SIZE / 2}px)`,
        }}>
            <CircularProgress size={CIRCLE_SIZE} />
        </Box>
    )
}
