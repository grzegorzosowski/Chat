import { Box, Link } from '@mui/material'
import { useAppSelector } from '../../hooks';
import styles from '../../styles/ChatOption.module.css'
import CreateChatModal from '../CreateChatModal/CreateChatModal';
import { ChangeAccountParam } from '../ChangeAccountParam/ChangeAccountParam';

export default function ChatOption(): JSX.Element {
  const activeChat = useAppSelector((state) => state.activeChat.activeChat);


  return (
    <Box className={styles.chatOptionBox}>
        <CreateChatModal></CreateChatModal>
        <ChangeAccountParam></ChangeAccountParam>

    </Box>
  )
}
