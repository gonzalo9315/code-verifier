import { Alert, AlertTitle, Box, Button, Container, CssBaseline, Grid, MenuItem } from "@mui/material"
import { AxiosResponse } from "axios"
import { useState } from "react"
import * as Yup from 'yup'
import { Field, Form, Formik } from "formik"
import { Select, TextField } from "formik-mui"
import { useSessionStorage } from "../../hooks/useSessionStorage"
import { updateUserByID } from "../../services/userService"
import { register } from "../../services/authService"
import { useLocation } from "react-router-dom"

export const UserForm = (props: any) => {

    const loggedIn = useSessionStorage('sessionJWTToken')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const location = useLocation();
    const paths = ['/profile']
    const fieldsPass = !props.user ? 
                        {
                            password: Yup.string()
                            .min(8, 'Password too short')
                            .required('Password is required'),
                            confirmPassword: Yup.string()
                            .oneOf([Yup.ref('password'), null], 'Password does not match')
                            .required('You must confirm the password')
                        }
                        :
                        {   password: Yup.string()
                            .min(8, 'Password too short'),
                            confirmPassword: Yup.string()
                            .oneOf([Yup.ref('password'), null], 'Password does not match')
                        }
    const fieldRole = !paths.includes(location.pathname) ? 
                        {
                            role: Yup.string()
                            .oneOf(['user', 'admin'])
                            .required('Role is required')
                        }
                        :
                            null
    const userSchema = Yup.object().shape(
        {
            ...fieldsPass,
            ...fieldRole,
            name: Yup.string()
                .min(6, 'Username must have 6 letters minimium')
                .max(12, 'Username must have maximun 12 letters')
                .required('Name is required'),
            email: Yup.string()
                .email('Invalid Email Format')
                .required('Email is required'),
            age: Yup.number()
                .min(10, 'You must be over 10 years old')
                .positive()
                .integer()
                .required('Age is required')
        }
    )

    return (
        <div>
            <Formik
                initialValues={
                    props.user ?
                        {
                            name: props.user.name,
                            email: props.user.email,
                            age: props.user.age,
                            role: props.user.role,
                            password: '',
                            confirmPassword: ''
                        }
                    :
                        {
                            name: '',
                            email: '',
                            age: '',
                            role: 'user',
                            password: '',
                            confirmPassword: ''
                        }
                }
                validationSchema={userSchema}
                onSubmit={async (values) => {
                    props.user ?
                        updateUserByID(loggedIn, props.user._id, values).then((response: AxiosResponse) => {
                            if (response.status === 200) {
                                setSuccess(true)
                                setError(false)
                            } else {
                                setSuccess(false)
                                setError(true)
                                throw new Error('Error in updated User')
                            }
                        }).catch((error) => console.error(`[UPDATE USER ERROR]: Something wrong: ${error}`))
                    :
                        register(values).then((response: AxiosResponse) => {
                            if(response.status === 200) {
                                setSuccess(true)
                                setError(false)
                            }else {
                                setSuccess(false)
                                setError(true)
                                throw new Error('Error in register User')
                            }
                        }).catch((error) => console.error(`[REGISTER ERROR]: Something wrong: ${error}`))
                }}
            >
                {
                    ({ values, touched, errors, submitForm, isSubmitting, handleChange, handleBlur, isValid, setFieldValue }) =>
                    (
                        <Form>
                            <Container component="main">
                                <CssBaseline />
                                <Box
                                    sx={{
                                        margin: '8px 0px 50px 0px',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
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
                                        <Grid item xs={12} sm={6}>
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
                                        <Grid item xs={12} sm={6}>
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
                                        <Grid item xs={12} sm={9}>
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
                                        {
                                            !paths.includes(location.pathname) ?
                                                <Grid item xs={12} sm={3}>
                                                    <Field
                                                        component={Select}
                                                        required
                                                        fullWidth
                                                        id="role"
                                                        label="role"
                                                        name="role"
                                                        type="text"
                                                    >
                                                        <MenuItem value="user">User</MenuItem>
                                                        <MenuItem value="admin">Admin</MenuItem>
                                                    </Field>
                                                </Grid>
                                            :
                                                null
                                        }
                                    </Grid>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3 }}
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                    >
                                        Submit
                                    </Button>
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
                        Submit correctly — <strong>check it out!</strong>
                    </Alert>
                    :
                    null
            }
            {
                error ?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Error in submit — <strong>check it out!</strong>
                    </Alert>
                    :
                    null
            }
        </div>
    )
}