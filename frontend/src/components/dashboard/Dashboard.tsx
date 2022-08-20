import React, { useEffect, useState } from "react"
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseLine from "@mui/material/CssBaseline"
import MuiDrawer from "@mui/material/Drawer"
import Box from "@mui/material/Box"
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Container from "@mui/material/Container"
import Badge from "@mui/material/Badge"
import Grid from "@mui/material/Grid"
import Typography from '@mui/material/Typography'
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from "@mui/icons-material/Notifications"
import { MenuItems } from "./MenuItems"
import { useSessionStorage } from "../../hooks/useSessionStorage"
import { useNavigate, useLocation } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import { StickyFooter } from "./StickyFooter"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
    open?: boolean
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overFlow: 'hidden',
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9)
                }
            })
        }
    }))

const myTheme = createTheme()

export const Dashboard = (props: any) => {

    const jwt = useSessionStorage('sessionJWTToken')
    let [loggedIn, setLoggedIn] = useState(jwt)
    // const [role, setRole] = useState(sessionStorage.getItem('role'))
    const navigate = useNavigate()
    const location = useLocation();
    const paths = ['/login', '/register']
    const [open, setOpen] = useState(false)
    
    useEffect(() => {
        if (!loggedIn && !paths.includes(location.pathname)) {
            return navigate('/')
        }
    }, [loggedIn])

    const toggleDrawer = () => {
        setOpen(!open)
    }

    const logout = () => {
        sessionStorage.removeItem('sessionJWTToken')
        sessionStorage.removeItem('role')
        sessionStorage.removeItem('name')
        setLoggedIn(false)
    }

    return (
        <ThemeProvider theme={myTheme}>
            <Box sx={{ display: 'flex'}}>
                <CssBaseLine />
                <AppBar position='absolute' open={open}>
                    <Toolbar sx={{ pr: '24px' }}>
                        { loggedIn ? 
                                <IconButton
                                    edge='start'
                                    color='inherit'
                                    aria-label='open drawer'
                                    onClick={toggleDrawer}
                                    sx={{
                                        marginRight: '36px',
                                        ...(open && {
                                            display: 'none'
                                        })
                                    }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            :
                                null
                        }
                        <Typography
                            component='h1'
                            variant='h6'
                            color='inherit'
                            noWrap
                            sx={{
                                flexGrow: 1
                            }}
                        >
                            {/* Code Verification Katas */}
                        </Typography>
                        <IconButton color='inherit' onClick={() => navigate('/')}>
                            <HomeIcon />
                        </IconButton>
                        { loggedIn ? 
                                <div>
                                    <IconButton color='inherit' onClick={() => navigate('/profile')}>
                                        <Badge color='secondary'>
                                            <AccountCircleIcon />
                                        </Badge>
                                    </IconButton>
                                    <IconButton color='inherit' onClick={logout}>
                                        <LogoutIcon />
                                    </IconButton>
                                </div>
                            :
                                null
                        }
                    </Toolbar>
                </AppBar>
                { loggedIn ? 
                        <Drawer 
                            variant='permanent' 
                            open={open} 
                            sx={{'& .MuiDrawer-paper': { overflow: 'hidden' }}}
                        >
                            <Toolbar
                                sx={{
                                    display: 'flex',
                                    align: 'center',
                                    justifyContent: 'flex-end',
                                    px: [1]
                                }}
                            >
                                {/* ICON to HIDE the Menu*/}
                                <IconButton color='inherit' onClick={toggleDrawer}>
                                    <ChevronLeftIcon />
                                </IconButton>
                            </Toolbar>
                            <Divider />
                            {/* List of menu items */}
                            <List component='nav'>
                                <MenuItems/>
                            </List>
                        </Drawer>
                    :
                        null            
                }
                {/* Dashboard Content */}
                <Box
                    component='main'
                    sx={{
                        backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                        flexGrow: 1,
                        minHeight: '100vh',
                        overFlow: 'auto'
                    }}
                >
                    <Toolbar />
                    {/* TODO  Navigation Content*/}
                    <Container maxWidth='lg' sx={{ mt: 4, mg: 4 }}>
                        <Grid item xs={12} md={12} lg={12}>
                            {props.data}
                        </Grid>
                    </Container>
                </Box>
            </Box>
            <StickyFooter />
        </ThemeProvider>
    )
}