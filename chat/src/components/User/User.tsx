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
    console.log('Dane z usera: ', user?.user)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const nick = user.user.nick;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('Aktywny chat: ', activeChat)
    const active = activeChat.activeChat.members.includes(nick);

    return (
        <>{!active ? (
            <Box className={styles.shape}>{nick}</Box>) : (
            <Box className={styles.shapeActive}>{nick}</Box>
        )}
        </>
    )
}
