import UserList from './UserList'
import ChatWindow from './ChatWindow'
import MessageBox from './MessageBox'
import { useIsMobile } from '../features/useIsMobile'
import MobileView from './MobileView/MobileView'
import { Box } from '@mui/material'
import { FOOTER_HEIGHT } from './Footer'

export default function ChatPage() {
    const isMobile = useIsMobile();
    return (
        <Box sx={{
            display: 'flex',
            height: `calc(100vh -  2 * ${FOOTER_HEIGHT}px)`,
        }}>
            {!isMobile && <Box sx={{
                position: 'fixed',
                left: '0px',
                width: '200px',
                height: `calc(100% - ${FOOTER_HEIGHT}px)`,
            }}><UserList /></Box>}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '20px auto',
                width: isMobile ? '100%' : '400px',
                height: `calc(100% - 40px)`,
            }}>
                {isMobile ? <MobileView />
                    :
                    <>
                        <ChatWindow />
                        <MessageBox />
                    </>
                }

            </Box>
        </Box>
    )
}
