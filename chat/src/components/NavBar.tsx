import React from 'react';
import { AppBar, Box, Toolbar, IconButton, Badge, MenuItem, Menu, Button, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import MoreIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import CreateIcon from '@mui/icons-material/Create';
import { LightMode } from '@mui/icons-material';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useUser } from '../UserProvider';
import { CreateAccountModal } from './CreateAccountModal';
import { useCurrentTheme } from '../features/currentThemeProvider';
import CreateChatModal from './CreateChatModal';
import { useIsMobile } from '../features/useIsMobile';
import { setActiveChat } from '../features/chats/chatsSlice';
import { useAppDispatch } from '../hooks';
import { useLogoutUserMutation } from '../features/api/apiSlice';

export default function PrimarySearchAppBar() {
    const isUser = useUser();
    const isMobile = useIsMobile();
    const dispatch = useAppDispatch();
    const [logoutUser] = useLogoutUserMutation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const [leftMenuAnchorEl, setLeftMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const isLeftMenuOpen = Boolean(leftMenuAnchorEl);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleClick = () => {
        void fetchData();
    }
    const fetchData = async () => {
        await logoutUser({})
        window.location.replace('/');
    }


    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleLeftMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setLeftMenuAnchorEl(event.currentTarget);
    };

    const handleLeftMenuClose = () => {
        setLeftMenuAnchorEl(null);
    };

    const handleSelectChat = () => {
        dispatch(setActiveChat({ chatID: '1', chatName: 'Select chat', members: [] }))
        handleLeftMenuClose();
    }

    const handleProfile = () => {
        handleMenuClose();
        window.location.replace('/profile');
    }

    const leftMenuItems = [
        { id: '1', name: 'Create group chat', component: <CreateChatModal closeLeftMenu={handleLeftMenuClose} />, icon: <CreateIcon /> },
    ]



    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 56,
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleProfile}><SettingsIcon fontSize='small' sx={{ mr: '15px' }} />Profile</MenuItem>
            <MenuItem onClick={handleClick}><PowerSettingsNewIcon fontSize='small' sx={{ mr: '15px' }} />Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 52,
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {/* <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem> */}
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="small"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                    sx={{ mr: '10px' }}
                >
                    <AccountCircle />
                </IconButton>
                <p>Account</p>
            </MenuItem>
        </Menu>
    );
    const leftMenuId = 'primary-search-account-menu-left';
    const leftMenu = (
        <Menu
            anchorEl={leftMenuAnchorEl}
            anchorOrigin={{
                vertical: isMobile ? 52 : 56,
                horizontal: 'left',
            }}
            id={leftMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            open={isLeftMenuOpen}
            onClose={handleLeftMenuClose}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
        >
            {isMobile && <MenuItem onClick={handleSelectChat} sx={{ width: '100%' }}><ChatIcon sx={{ mr: '10px' }} />Select chat</MenuItem>}
            {leftMenuItems.map((item) => (
                <MenuItem key={item.id}><Typography sx={{ mr: '10px' }}>{item.icon}</Typography>{item.component}</MenuItem>))}
        </Menu>
    )



    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    {isUser ? <><IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 1 }}
                        onClick={handleLeftMenuOpen}
                    >
                        {isLeftMenuOpen ? <ExpandLessIcon /> : <MenuIcon />}
                    </IconButton>

                        <ChangeThemeButton />
                        <Box sx={{ flexGrow: 1, cursor: 'pointer', pl: '20px' }} onClick={() => { window.location.replace('/') }}>CHAT</Box>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <>
                                {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                                <Badge badgeContent={4} color="error">
                                    <MailIcon />
                                </Badge>
                            </IconButton> */}

                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton> </>
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                {isMobileMenuOpen ? <ExpandLessIcon /> : <MoreIcon />}
                            </IconButton>
                        </Box> </> :
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}><ChangeThemeButton /> <CreateAccountModal /></Box>}
                </Toolbar>
            </AppBar>
            {leftMenu}
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}

function ChangeThemeButton() {
    const currentTheme = useCurrentTheme();
    return (
        <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => currentTheme.setTheme(currentTheme.theme === 'light' ? 'dark' : 'light')}
            sx={{
                ml: '10px'
            }}
        >
            {currentTheme.theme === 'dark' ? <ModeNightIcon /> : <LightMode />}
        </IconButton>
    );
}




{/* 

import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
<Search>
    <SearchIconWrapper>
        <SearchIcon />
    </SearchIconWrapper>
    <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
    />
</Search> 

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));


*/

}