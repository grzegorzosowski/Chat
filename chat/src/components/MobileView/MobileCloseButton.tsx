import CloseIcon from '@mui/icons-material/Close';

type MobileCloseButtonProps = {
    handleClose: (bool: boolean) => void;
}

export default function MobileCloseButton({ handleClose }: MobileCloseButtonProps) {


    return (
        <CloseIcon
            onClick={handleClose.bind(null, false)}
            sx={{
                fontSize: '30px',
                position: 'absolute',
                top: '2px',
                right: '2px',
                cursor: 'pointer',
                zIndex: '1000',
                color: 'white',
                borderRadius: '10px',
                backgroundColor: '#0f5396',
            }}></CloseIcon>
    )
}
