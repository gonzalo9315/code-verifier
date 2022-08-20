import React, { useState } from "react"
import { Box, Button, Container, CssBaseline, Grid, Typography, MenuItem, Paper } from "@mui/material"
import { AxiosResponse } from "axios"
// import { useNavigate } from 'react-router-dom'
import { useSessionStorage } from "../hooks/useSessionStorage"
import { createKata } from "../services/katasService"
import * as Yup from 'yup'
import { Field, Form, Formik } from "formik"
import { Select, TextField } from "formik-mui"
import { NewEditor } from "../components/editor/NewEditor"
import { FileUploader } from "../components/uploader/FileUploader"
import { FileValidated } from "@dropzone-ui/react"

export const CreateKataPage = () => {

    const loggedIn = useSessionStorage('sessionJWTToken')
    // const navigate = useNavigate()
    // let solution = ''
    const [solution, setSolution] = useState('');
    const [files, setFiles] = useState<FileValidated[]>([])

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
                .required('You must confirm you password')
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
        <Paper sx={{ padding: '20px' }}>
            <div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={kataSchema}
                    onSubmit={async (values, { resetForm }) => {
                        const data = { ...values, solution }
                        createKata(loggedIn, data, files).then((response: AxiosResponse) => {
                            if (response.status === 201) {
                                alert('Kata Created correctly!')
                                resetForm()
                            } else {
                                throw new Error('Error in create Kata')
                            }
                        }).catch((error) => console.error(`[CREATE KATA ERROR]: Something wrong: ${error}`))
                    }}
                >
                    {
                        ({ values, touched, errors, submitForm, isSubmitting, handleChange, handleBlur, isValid, setFieldValue }) =>
                        (
                            <Form>
                                <Container component="main" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <CssBaseline />
                                    <Box
                                        sx={{
                                            margin: '8px 0px 50px 0px',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                        maxWidth="sm"
                                    >
                                        <Typography component="h1" variant="h5" style={{ marginBottom: '20px' }}>
                                            New Kata:
                                        </Typography>
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
                                            <Grid item xs={12} sm={12}>
                                                <Typography variant="body1">
                                                    Solution:
                                                </Typography>
                                                <NewEditor
                                                    func={pullData}
                                                    codeSolution=''
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: '100%'
                                        }}
                                    >
                                        <Grid item xs={12} md={12}>
                                            <Typography variant="body1">
                                                Subir Archivos:
                                            </Typography>
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
            </div>
        </Paper>
    )
}