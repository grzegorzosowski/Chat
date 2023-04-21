import Box from '@mui/material/Box'
import styles from '../../styles/User.module.css'
import { useAppSelector } from '../../hooks'

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
            <Box className={styles.shape}>{nick}</Box>) : (
            <Box className={styles.shapeActive}>{nick}</Box>
        )}
        </>
    )
}
