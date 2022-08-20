import { Alert, AlertTitle, Box, Button, Container, CssBaseline, Grid, Typography } from "@mui/material"
import { AxiosResponse } from "axios"
import { useState } from "react"
import { Form, Formik } from "formik"
import { deleteKataByID } from "../../services/katasService"
import { useSessionStorage } from "../../hooks/useSessionStorage"
import { deleteUserByID } from "../../services/userService"

export const DeleteForm = (props: any) => {
    
    const loggedIn = useSessionStorage('sessionJWTToken')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    return (
        <div>
            {
                success ? 
                    <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                        Deleted correctly — <strong>check it out!</strong>
                    </Alert>
                :
                    <Formik
                        initialValues={{}}
                        onSubmit={async () => {
                            props.type === 'kata' ?
                                deleteKataByID(loggedIn, props.data._id).then((response: AxiosResponse) => {
                                    if (response.status === 200) {
                                        setSuccess(true)
                                        setError(false)
                                    } else {
                                        setSuccess(false)
                                        setError(true)
                                        throw new Error('Error in delete Kata')
                                    }
                                }).catch((error) => console.error(`[DELETE KATA ERROR]: Something wrong: ${error}`))
                            :
                                deleteUserByID(loggedIn, props.data._id).then((response: AxiosResponse) => {
                                    if (response.status === 200) {
                                        setSuccess(true)
                                        setError(false)
                                    } else {
                                        setSuccess(false)
                                        setError(true)
                                        throw new Error('Error in deleted user')
                                    }
                                }).catch((error) => console.error(`[DELETE USER ERROR]: Something wrong: ${error}`))
                        }}
                        >
                        {
                            ({ values, touched, errors, submitForm, isSubmitting, handleChange, handleBlur, isValid }) =>
                            (
                                <Form>
                                    <Container component="main" maxWidth="sm">
                                        <CssBaseline />
                                        <Box
                                            sx={{
                                                marginTop: 2,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                minWidth: '170px'
                                            }}
                                        >
                                            <Grid 
                                                container
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Grid item xs={12} sm={9}>
                                                    <Typography variant="h6" component="h6">
                                                        Are you sure?
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid 
                                                container 
                                                spacing={2}                                        
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Grid item xs={6}>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        color='error'
                                                        sx={{ mt: 2, mb: 2 }}
                                                        disabled={isSubmitting}
                                                        onClick={submitForm}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Container>
                                </Form>
                            )
                        }
                    </Formik>
            }
            {
                error ? 
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Error in deleted — <strong>check it out!</strong>
                    </Alert>
                :
                    null
            }
        </div>
    )
}