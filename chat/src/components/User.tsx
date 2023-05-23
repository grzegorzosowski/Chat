import Box from '@mui/material/Box'
import { useAppSelector } from '../hooks'

interface UserProps {
    user: {
        _id: string;
        nick: string;
    };
}


export default function User(user: UserProps): JSX.Element {
    const activeChat = useAppSelector((state) => state.activeChat)
    const id = user.user._id;
    const nick = user.user.nick;
    let active
    if (activeChat.activeChat.members.length === 2) {
        active = activeChat.activeChat.members.includes(id);
    } else {
        active = false;
    }

    return (
        <>{!active ? (
            <Box sx={{
                p: '5px',
                borderRadius: '10px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                fontSize: '15px',
                color: '#000',
                fontWeight: '600',
                mb: '5px',
                boxSizing: 'border-box',
            }}>{nick}</Box>) : (
            <Box sx={(theme) => ({
                p: '5px',
                borderRadius: '10px',
                backgroundColor: theme.palette.primary.light,
                display: 'flex',
                alignItems: 'center',
                fontSize: '15px',
                color: '#000',
                fontWeight: '600',
                mb: '5px',
                boxSizing: 'border-box',
                boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.9)',
            })}>{nick}</Box>
        )}
        </>
    )
}
