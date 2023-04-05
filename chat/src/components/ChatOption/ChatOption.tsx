import { Box, Link } from '@mui/material'
import { useAppSelector } from '../../hooks';
import styles from '../../styles/ChatOption.module.css'
import CreateChatModal from '../CreateChatModal/CreateChatModal';

export default function ChatOption(): JSX.Element {
  const activeChat = useAppSelector((state) => state.activeChat.activeChat);


  return (
    <Box className={styles.chatOptionBox}>
      {activeChat.chatName !== 'Chat 1' ?
        (<>
        <Box><Link className={styles.linkStyle}><CreateChatModal></CreateChatModal> </Link></Box></>) :
        (<Box><Link className={styles.linkStyle}>Create new chat</Link></Box>)}
    </Box>
  )
}
