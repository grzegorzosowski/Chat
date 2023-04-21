import { Box } from '@mui/material'
import styles from '../../styles/ChatOption.module.css'
import CreateChatModal from '../CreateChatModal/CreateChatModal';
import { ChangeAccountParam } from '../ChangeAccountParam/ChangeAccountParam';

export default function ChatOption(): JSX.Element {


  return (
    <Box className={styles.chatOptionBox}>
      <CreateChatModal></CreateChatModal>
      <ChangeAccountParam></ChangeAccountParam>
    </Box>
  )
}
