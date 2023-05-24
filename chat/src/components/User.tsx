import Box from '@mui/material/Box'
import { useAppSelector } from '../hooks'

interface UserProps {
    user: {
        _id: string;
        nick: string;
    };
    isLogged: boolean | undefined
}


export default function User({ user, isLogged }: UserProps,): JSX.Element {
    const activeChat = useAppSelector((state) => state.activeChat)
    const id = user._id;
    const nick = user.nick;
    let active: boolean
    if (activeChat.activeChat.members.length === 2) {
        active = activeChat.activeChat.members.includes(id);
    } else {
        active = false;
    }

    return (
        <>
            <Box sx={(theme) => ({
                p: '5px',
                borderRadius: '10px',
                backgroundColor: active ? theme.palette.primary.light : '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                fontSize: '15px',
                color: '#000',
                fontWeight: '600',
                mb: '5px',
                boxSizing: 'border-box',
                boxShadow: active ? '0 0 10px 0 rgba(0, 0, 0, 0.9)' : '',
                position: 'relative',
            })}>
                <LoggedDot isLogged={isLogged} />
                {nick}</Box>
        </>
    )
}

const LoggedDot = ({ isLogged }: { isLogged: boolean | undefined }) => {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: '6px',
                right: '5px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isLogged ? '#55eb34' : 'gray',
            }}
        />
    )
}
