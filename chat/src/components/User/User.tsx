import Box from '@mui/material/Box'
import styles from '../../styles/User.module.css'

export default function User(user: any): JSX.Element {
    console.log('Dane z usera: ',user)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const nick = user.user.nick
    return (
        <Box className={styles.shape}>{nick}</Box>
    )
}
