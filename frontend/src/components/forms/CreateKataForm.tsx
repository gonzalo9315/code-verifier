import { Alert, AlertTitle, Box, Button, Container, CssBaseline, Grid, MenuItem } from "@mui/material"
import { AxiosResponse } from "axios"
import { useState } from "react"
import * as Yup from 'yup'
import { Field, Form, Formik } from "formik"
import { Select, TextField } from "formik-mui"
import { createKata } from "../../services/katasService"
import { useSessionStorage } from "../../hooks/useSessionStorage"
import { FileUploader } from "../uploader/FileUploader"
import { NewEditor } from "../editor/NewEditor"
import { FileValidated } from "@dropzone-ui/react"

export const CreateKataForm = (props: any) => {
    
    const loggedIn = useSessionStorage('sessionJWTToken')
    const [solution, setSolution] = useState('');
    const [files, setFiles] = useState<FileValidated[]>([])
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const kataSchema = Yup.object().shape(
        {
            name: Yup.string()
                .min(6, 'Name must have 6 letters minimium')
                .max(50, 'Name must have maximun 12 letters')
                .required('Name is required'),
            description: Yup.string()
                .min(6, 'Description must have 6 letters minimium')
                .max(300, 'Description must have maximun 300 letters')
                .required('Description is required'),
            level: Yup.string()
                .oneOf(['Basic', 'Medium', 'High'])
                .required('Level is required'),
            intents: Yup.number()
                .positive()
                .integer()
        }
    )

    const initialValues = {
        name: '',
        description: '',
        level: 'Basic',
        intents: 1
    }

    const pullData = (data: any) => {
        setSolution(data)
    }

    const getFiles = (files: any) => {
        setFiles(files)
    }

    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={kataSchema}
                onSubmit={async (values, { resetForm }) => {
                    const data = { ...values, solution }
                    createKata(loggedIn, data, files).then((response: AxiosResponse) => {
                        if (response.status === 201) {
                            setSuccess(true)
                            setError(false)
                            resetForm()
                        } else {
                            setSuccess(false)
                            setError(true)
                            throw new Error('Error in create Kata')
                        }
                    }).catch((error) => console.error(`[CREATE KATA ERROR]: Something wrong: ${error}`))
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
                                        <Grid item xs={12} sm={9}>
                                            <Field
                                                component={TextField}
                                                name="name"
                                                required
                                                fullWidth
                                                id="name"
                                                label="Name"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <Field
                                                component={Select}
                                                required
                                                fullWidth
                                                id="level"
                                                label="Level"
                                                name="level"
                                                type="text"
                                            >
                                                <MenuItem value="Basic">Basic</MenuItem>
                                                <MenuItem value="Medium">Medium</MenuItem>
                                                <MenuItem value="High">High</MenuItem>
                                            </Field>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={TextField}
                                                required
                                                fullWidth
                                                id="description"
                                                label="description"
                                                name="description"
                                                type="text"
                                                multiline
                                                maxRows={4}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={TextField}
                                                required
                                                fullWidth
                                                name="intents"
                                                label="Intents"
                                                type="text"
                                                id="intents"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={12} mt={2}>
                                        <NewEditor
                                            func={pullData}
                                            codeSolution=''
                                        />
                                    </Grid>
                                    <Grid item xs={12} mt={3}>
                                        <FileUploader func={getFiles} upload={false}/>
                                    </Grid>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                    >
                                        Create Kata
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
                        Kata created correctly — <strong>check it out!</strong>
                    </Alert>
                :
                    null
            }
            {
                error ? 
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Error in create Kata — <strong>check it out!</strong>
                    </Alert>
                :
                    null
            }
        </div>
    )
}