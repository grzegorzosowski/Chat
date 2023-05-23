import UserList from '../UserList'
import ChatWindow from '../ChatWindow'
import MessageBox from '../MessageBox'
import { Box } from '@mui/material'
import { useAppSelector } from '../../hooks'

export default function MobileView() {
    const activeChat = useAppSelector((state) => state.activeChat.activeChat);
    return (
        <>
            {activeChat.chatID !== '1' ? <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '90vh',
                width: '100%',
            }}>
                <Box
                    sx={{
                        height: '80%',
                        width: '100%',
                    }}>
                    <ChatWindow data-testid='test-ChatWindow'></ChatWindow>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        height: '20%',
                    }}>
                    <MessageBox data-testid='test-MessageBox'></MessageBox>
                </Box>
            </Box>
                :
                <Box sx={{
                    width: '100%',
                    height: '100%',
                }}>
                    <UserList />
                </Box>
            }
        </>
    )
}
