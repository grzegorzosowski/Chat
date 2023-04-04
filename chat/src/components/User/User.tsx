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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const id = user.user._id;
    const nick = user.user.nick;
    const active = activeChat.activeChat.members.includes(id);

    return (
        <>{!active ? (
            <Box className={styles.shape}>{nick}</Box>) : (
            <Box className={styles.shapeActive}>{nick}</Box>
        )}
        </>
    )
}
