import { Box, Modal } from '@mui/material'
import React from 'react'
import { useIsMobile } from '../../features/useIsMobile';

type MobileModalProps = {
    open: boolean;
    handleClose: (bool: boolean) => void;
    children: React.ReactNode;
}
export default function MobileModal({ open, handleClose, children }: MobileModalProps) {
    const isMobile = useIsMobile();
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%)`,
                width: isMobile ? '90%' : '20%',
                backgroundColor: 'white',
                border: '2px solid #000',
                boxShadow: '24px',
                padding: '10px',
                borderRadius: '5px',
            }}>
                {children}
            </Box>
        </Modal>
    )
}
