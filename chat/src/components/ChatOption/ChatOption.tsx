import { Box, Link } from '@mui/material'
import { useAppSelector } from '../../hooks';
import styles from '../../styles/ChatOption.module.css'

export default function ChatOption(): JSX.Element {
  const activeChat = useAppSelector((state) => state.activeChat.activeChat);

  return (
    <Box className={styles.chatOptionBox}>
      {activeChat.chatName !== 'Chat 1' ?
        (<><Box><Link className={styles.linkStyle}>Change chat name</Link></Box>
        <Box><Link className={styles.linkStyle}>Create new chat</Link></Box></>) :
        (<Box><Link className={styles.linkStyle}>Create new chat</Link></Box>)}
    </Box>
  )
}
