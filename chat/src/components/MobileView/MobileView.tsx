import React from 'react'
import UserList from '../UserList'
import ChatWindow from '../ChatWindow'
import ChatOption from '../ChatOption'
import MessageBox from '../MessageBox'
import { Box, Button } from '@mui/material'
import MobileCloseButton from './MobileCloseButton'
import MobileModal from './MobileModal'

export default function MobileView() {
    const [openUsers, setOpenUsers] = React.useState(false);
    const [openOptions, setOpenOptions] = React.useState(false);
    const handleOpen = () => setOpenUsers(true);
    const handleClose = () => setOpenUsers(false);
    const handleOpenOptions = () => setOpenOptions(true);
    const handleCloseOptions = () => setOpenOptions(false);
    return (
        <>
            <Box data-testid='test-UserList' sx={{
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
            <Box data-testid='test-ChatOption' sx={{
                position: 'fixed',
                top: '10px',
                right: '10px',
            }}>
                <Button onClick={handleOpenOptions} variant='outlined'>Options</Button>
                <MobileModal open={openOptions} handleClose={handleCloseOptions}>
                    <MobileCloseButton data-testid='test-MobileCloseButton' handleClose={setOpenOptions}></MobileCloseButton>
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
        </>
    )
}
