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
import { register } from "../../services/authService"
import { AxiosResponse } from "axios"
import { TextField } from 'formik-mui';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, AlertTitle } from '@mui/material';
import { useState } from 'react';

export default function RegisterForm() {

    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const navigate = useNavigate()

    const registerSchema = Yup.object().shape(
        {
            name: Yup.string()
                .min(6, 'Username must have 6 letters minimium')
                .max(12, 'Username must have maximun 12 letters')
                .required('Name is required'),
            email: Yup.string()
                .email('Invalid Email Format')
                .required('Email is required'),
            password: Yup.string()
                .min(8, 'Password too short')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Password does not match')
                .required('You must confirm you password'),
            age: Yup.number()
                .min(10, 'You must be over 10 years old')
                .positive()
                .integer()
                .required('Age is required')
        }
    )
    const initialCredentials = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: 18
    }

    return (
        <div>

            <Formik 
                initialValues={ initialCredentials }
                validationSchema={ registerSchema }
                onSubmit={ async (values) => {
                    register(values).then((response: AxiosResponse) => {
                        if(response.status === 200) {
                            setSuccess(true)
                            setTimeout(() => navigate('/login'), 5000)
                        }else {
                            throw new Error('Error in registry')
                        }
                    }).catch((error) => {
                        console.error(`[REGISTER ERROR]: Something wrong: ${error}`)
                        setError(true)
                    })
                }}    
            >
                {
                    ({ values, touched, errors, submitForm, isSubmitting, handleChange, handleBlur, isValid }) => 
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
                                    Sign up
                                </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                            component={TextField} 
                                            name="name"
                                            required
                                            fullWidth
                                            id="name"
                                            label="Name"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                            component={TextField} 
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                            component={TextField} 
                                            required
                                            fullWidth
                                            id="password"
                                            label="Password"
                                            name="password"
                                            type="password"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                            component={TextField} 
                                            required
                                            fullWidth
                                            name="confirmPassword"
                                            label="Confirm password"
                                            type="password"
                                            id="confirmPassword"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                            component={TextField} 
                                            required
                                            fullWidth
                                            name="age"
                                            label="Age"
                                            type="text"
                                            id="age"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                        >
                                        Sign Up
                                    </Button>
                                    <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link to="/login">
                                        Already have an account? Sign in
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
                success ? 
                    <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                        User registered correctly — <strong>Redirect to login in 5s!</strong>
                    </Alert>
                :
                    null
            }
            {
                error ? 
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Error in registry — <strong>check it out!</strong>
                    </Alert>
                :
                    null
            }
        </div>
    );
}