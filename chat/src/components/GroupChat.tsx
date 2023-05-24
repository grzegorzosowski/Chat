import Box from '@mui/material/Box'
import { useAppSelector } from '../hooks'

interface GroupChatProps {
    groupChat: {
        _id: string;
        chatName: string;
        members: string[];
    }
}


export default function GroupChat(groupChat: GroupChatProps): JSX.Element {
    const activeChat = useAppSelector((state) => state.activeChat)
    const id = groupChat.groupChat._id;
    const chatName = groupChat.groupChat.chatName;
    const active = activeChat.activeChat.chatID.includes(id);

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
            })}>{chatName}</Box>
        </>
    )
}
