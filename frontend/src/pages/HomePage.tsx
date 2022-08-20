import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useSessionStorage } from '../hooks/useSessionStorage'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getKatasRecentlies } from '../services/katasService'
import { AxiosResponse } from 'axios'
import { Kata } from '../utils/types/Kata.types'

export const HomePage = () => {

    const loggedIn = useSessionStorage('sessionJWTToken')
    const role = sessionStorage.getItem('role')
    const [katas, setKatas] = useState([])
    const navigate = useNavigate()
    const theme = createTheme()

    useEffect(() => {
        getKatasRecentlies(9, 1).then((response: AxiosResponse) => {
            if (response.status === 200) {
                setKatas(response.data.katas)
            } else {
                throw new Error(`Error obtaining katas: ${response.data}`)
            }
        })
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                {/* Hero unit */}
                {!loggedIn ?
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            pt: 8,
                            pb: 6,
                        }}
                    >
                        <Container maxWidth="sm">
                            <Typography
                                component="h1"
                                variant="h2"
                                align="center"
                                color="text.primary"
                                gutterBottom
                            >
                                Katas
                            </Typography>
                            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                                It is a web project in which users can find exercise statements (Katas) in which
                                to practice development in different programming languages.
                            </Typography>
                            <Stack
                                sx={{ pt: 4 }}
                                direction="row"
                                spacing={2}
                                justifyContent="center"
                            >
                                <Link to='/login'>
                                    <Button variant="contained" size="large">Log in</Button>
                                </Link>
                                <Link to='/register'>
                                    <Button variant="outlined" size="large">Sign in</Button>
                                </Link>
                            </Stack>
                        </Container>
                    </Box>
                    :
                    null
                }
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Typography
                        component="h1"
                        variant="h4"
                        align="center"
                        color="text.primary"
                        gutterBottom
                    >
                        Recentlies:
                    </Typography>
                    <Grid container spacing={4}>
                        {katas.map((kata: Kata) => (
                            <Grid item key={kata._id} xs={12} sm={6} md={4}>
                                <Card
                                    sx={{ maxWidth: 345 }}
                                >
                                    <CardMedia
                                        component="img"
                                        alt="kata.img"
                                        height="200"
                                        image={require("../assets/img/kata.png")}
                                        sx={{ backgroundColor: '#8ec3f7' }}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {kata.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {kata.description}.
                                        </Typography>
                                    </CardContent>
                                    {
                                        role === 'user' ? 
                                            <CardActions sx={{justifyContent: 'center'}}>
                                                <Button 
                                                    variant="outlined" 
                                                    size="small"  
                                                    onClick={() => navigate(`katas/${kata._id}`)}
                                                >
                                                    View
                                                </Button>
                                            </CardActions>
                                        :
                                            null
                                    }
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
        </ThemeProvider>
    )
}