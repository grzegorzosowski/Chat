import { Box } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

export function Condition({ value, children }: { value: boolean; children: React.ReactNode }) {
    const Wrapper = value ? Correct : Incorrect;
    return <Wrapper>{children}</Wrapper>;
}

function Correct({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ color: 'green', display: 'flex', mb: '5px' }}>
            <CheckIcon sx={{ mr: '10px' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{children}</Box>
        </Box>
    );
}

function Incorrect({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ color: 'red', display: 'flex', mb: '5px' }}>
            <ClearIcon sx={{ mr: '10px' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{children}</Box>
        </Box>
    );
}

