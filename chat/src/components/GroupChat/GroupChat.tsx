import Box from '@mui/material/Box'
import styles from '../../styles/User.module.css'
import { useAppSelector } from '../../hooks'

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
    const nick = groupChat.groupChat.chatName;
    const active = activeChat.activeChat.chatID.includes(id);

    return (
        <>{!active ? (
            <Box className={styles.shape}>{nick}</Box>) : (
            <Box className={styles.shapeActive}>{nick}</Box>
        )}
        </>
    )
}
