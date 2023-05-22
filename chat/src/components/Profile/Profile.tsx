import { Box, Button } from '@mui/material'
import React from 'react'
import ProfileInfo from './ProfileInfo';
import { useIsMobile } from '../../features/useIsMobile';
import { ChangeAccountParam } from '../ChangeNick';

const MenuItems = [
    { name: 'Profile Info', component: <ProfileInfo /> },
    { name: 'Change Nick', component: <ChangeAccountParam /> },
    { name: 'Change Password', component: <div>Change Password</div> },
]

export default function Profile() {
    const isMobile = useIsMobile();
    const [activeOption, setActiveOption] = React.useState<string>('Profile Info');

    const handleClick = (name: string) => {
        setActiveOption(name);
    }

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                display: isMobile ? 'block' : 'flex',
            }}
        >
            <Box
                sx={{
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '90%' : '300px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                }}
            >
                {MenuItems.map((item) => (
                    <CustomButton
                        key={item.name}
                        onClick={() => handleClick(item.name)}
                        active={activeOption === item.name}
                        name={item.name}
                    />
                ))}
            </Box>
            <Box
                sx={{
                    position: isMobile ? 'relative' : 'absolute',
                    left: isMobile ? '0' : '25%',
                    right: 'auto',
                    width: isMobile ? '100%' : '1000px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: '20px'
                }}
            >
                <Box
                    sx={(theme) => ({
                        width: '100%',
                        height: '300px',
                        backgroundColor:
                            theme.palette.mode === 'dark'
                                ? theme.palette.divider
                                : theme.palette.neutral?.light,
                        borderRadius: '5px',
                    })}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {MenuItems.find((item) => item.name === activeOption)?.component}
                    </Box>
                </Box>
            </Box>
        </Box>
    )

}
type CustomButtonType = {
    active: boolean,
    onClick: () => void,
    name: string,
}

const CustomButton = ({ active, onClick, name }: CustomButtonType) => {
    return (
        <Button variant='outlined' onClick={onClick} sx={(theme) => ({
            width: '100%',
            color: theme.palette.mode === 'dark' ? (theme.palette.neutral?.light) : (theme.palette.neutral?.main),
            border: active ? '1px solid' : 'none',
            borderColor: active ? theme.palette.primary.main : 'none',
            borderRadius: '5px',
        })}>{name}</Button>
    )
}