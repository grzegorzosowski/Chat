import React from 'react'
import UserList from '../../components/UserList/UserList'
import ChatWindow from '../../components/ChatWindow/ChatWindow'
import ChatOption from '../../components/ChatOption/ChatOption'
import MessageBox from '../../components/MessageBox/MessageBox'
import { Box, Button, Modal } from '@mui/material'
import { useIsMobile } from '../../features/useIsMobile'
import CloseIcon from '@mui/icons-material/Close';
import MobileCloseButton from './MobileCloseButton'
import MobileModal from './MobileModal'

export default function MobileView() {
    const [openUsers, setOpenUsers] = React.useState(false);
    const [openOptions, setOpenOptions] = React.useState(false);
    const isMobile = useIsMobile();
    const handleOpen = () => setOpenUsers(true);
    const handleClose = () => setOpenUsers(false);
    const handleOpenOptions = () => setOpenOptions(true);
    const handleCloseOptions = () => setOpenOptions(false);
    return (
        <>
            <Box sx={{
                position: 'fixed',
                top: '10px',
                left: 'auto',
                right: 'auto',
            }}>
                <Button onClick={handleOpen} variant='outlined'>Chats</Button>
                <MobileModal open={openUsers} handleClose={handleClose}>
                    <MobileCloseButton handleClose={setOpenUsers}></MobileCloseButton>
                    <UserList></UserList>
                </MobileModal>
            </Box>
            <Box sx={{
                position: 'fixed',
                top: '10px',
                right: '10px',
            }}>
                <Button onClick={handleOpenOptions} variant='outlined'>Options</Button>
                <MobileModal open={openOptions} handleClose={handleCloseOptions}>
                    <MobileCloseButton handleClose={setOpenOptions}></MobileCloseButton>
                    <ChatOption></ChatOption>
                </MobileModal>
            </Box>


            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80vh',
                width: '95%',
            }}>
                <Box sx={{
                    height: '80%',
                    width: '100%',
                }}>
                    <ChatWindow></ChatWindow>
                </Box>
                <Box sx={{
                    width: '100%',
                    height: '20%',
                }}>
                    <MessageBox></MessageBox>
                </Box>
            </Box>
        </>
    )
}
