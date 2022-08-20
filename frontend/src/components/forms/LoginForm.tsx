import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Formik, Form, Field } from "formik"
import * as Yup from 'yup'
import { login } from "../../services/authService"
import { AxiosResponse } from "axios"
import { Link } from 'react-router-dom'
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { Alert, AlertTitle } from '@mui/material';

export const LoginForm = () => {

    const [error, setError] = useState(false)

    // Define Schema of validation with Yup
    const loginSchema = Yup.object().shape(
        {
            email: Yup.string().email('Invalid Email Format').required('Email is required'),
            password: Yup.string().required('Password is required')
        }
    )
    const initialCredentials = {
        email: '',
        password: ''
    }

    return (
        <div>
            <Formik 
                initialValues={ initialCredentials }
                validationSchema={ loginSchema }
                onSubmit={ async (values) => {
                    login(values.email, values.password).then( async (response: AxiosResponse) => {
                        if(response.status === 200) {
                            if(response.data.token){                      
                                await sessionStorage.setItem('sessionJWTToken', response.data.token)
                                await sessionStorage.setItem('role', response.data.role)
                                await sessionStorage.setItem('name', response.data.name)
                                window.location.replace("/")
                            }else{
                                throw new Error('Invalid Credentials')
                            }
                        }
                    }).catch((error) =>{
                        console.error(`[LOGIN ERROR]: Something wrong: ${error}`) 
                        setError(true)
                    })
                }}    
            >
                {
                    ({ values, touched, errors, submitForm, isSubmitting, handleChange, handleBlur }) => 
                    (
                        <Form>
                            <Container component="main" maxWidth="xs">
                                <CssBaseline />
                                <Box
                                    sx={{
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    }}
                                >
                                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                    <LockOutlinedIcon />
                                    </Avatar>
                                    <Typography component="h1" variant="h5">
                                        Sign in
                                    </Typography>
                                    <Field
                                        component={TextField} 
                                        fullWidth
                                        margin="normal"
                                        required
                                        id='email' 
                                        type='email' 
                                        name='email' 
                                        label="Email Address"
                                    />
                                    <Field 
                                        component={TextField} 
                                        fullWidth
                                        margin="normal"
                                        required
                                        id='password' 
                                        type='password' 
                                        name='password' 
                                        label="Password"
                                    />
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                    >
                                        Sign In
                                    </Button>
                                    <Grid container>
                                        <Grid item xs>
                                        <Link to="#">
                                            Forgot password?
                                        </Link>
                                        </Grid>
                                        <Grid item>
                                        <Link to="/register">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Container>
                        </Form>
                    )
                }
            </Formik>
            {
                error ? 
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Invalid credentials — <strong>check it out!</strong>
                    </Alert>
                :
                    null
            }
        </div>
    )
}