import { Box } from '@mui/material'
import styles from '../styles/ChatOption.module.css'
import CreateChatModal from './CreateChatModal';
import { ChangeAccountParam } from './ChangeAccountParam';

export default function ChatOption(): JSX.Element {


  return (
    <Box className={styles.chatOptionBox}>
      <CreateChatModal></CreateChatModal>
      <ChangeAccountParam></ChangeAccountParam>
    </Box>
  )
}
