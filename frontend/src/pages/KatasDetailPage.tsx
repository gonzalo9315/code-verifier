import { Box, Button, Container, CssBaseline, Grid, Typography, Paper, CircularProgress, MenuItem, Alert, AlertTitle, Tooltip } from "@mui/material"
import { AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { useSessionStorage } from "../hooks/useSessionStorage"
import { getKataByID, resolveKataByID, scoreKataByID } from "../services/katasService"
import { Kata } from "../utils/types/Kata.types"
import * as Yup from 'yup'
import { NewEditor } from "../components/editor/NewEditor"
import { DialogMain } from "../components/dialog/DialogMain"
import { EditKataForm } from "../components/forms/EditKataForm"
import { DeleteForm } from "../components/forms/DeleteForm"
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import EditIcon from '@mui/icons-material/Edit'
import { Field, Form, Formik } from "formik"
import { Select } from "formik-mui"

export const KatasDetailPage = () => {

    const { id } = useParams()
    const loggedIn = useSessionStorage('sessionJWTToken')
    const userName = sessionStorage.getItem('name')
    const navigate = useNavigate()
    const [kata, setKata] = useState<Kata | undefined>(undefined)
    const [showSolution, setShowSolution] = useState(true)
    const [showResolve, setshowResolve] = useState(true)
    const [score, setScore] = useState(false)
    const [solution, setSolution] = useState('');
    const [reload, setReload] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!loggedIn) {
            return navigate('/login')
        } else {
            if (id) {
                getKataByID(loggedIn, id).then((response: AxiosResponse) => {
                    if (response.status === 200 && response.data) {
                        const kata: Kata = {
                            _id: response.data._id,
                            name: response.data.name,
                            description: response.data.description,
                            stars: response.data.stars,
                            level: response.data.level,
                            intents: response.data.intents,
                            creator: response.data.creator,
                            solution: response.data.solution,
                            participants: response.data.participants
                        }
                        setKata(kata)
                        if (kata.participants.some((el: any) => el.user === userName)) setScore(true)
                    } else {
                        throw new Error(`Error obtaining katas: ${response.data}`)
                    }
                }).catch((error) => console.log(`[Kata By ID ERROR]: ${error}`))
            } else {
                return navigate('/login')
            }
        }
    }, [loggedIn, reload])

    const kataSchema = Yup.object().shape(
        {
            name: Yup.string()
                .min(6, 'Name must have 6 letters minimium')
                .max(50, 'Name must have maximun 12 letters')
                .required('Name is required'),
            description: Yup.string()
                .min(6, 'Description must have 6 letters minimium')
                .max(50, 'Description must have maximun 12 letters')
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
        name: kata?.name,
        description: kata?.description,
        level: kata?.level,
        intents: kata?.intents
    }

    const resolveKata = async (values: any) => {
        resolveKataByID(loggedIn, id!, solution).then((response: AxiosResponse) => {
            if (response.status === 200) {
                setshowResolve(!showResolve)
                setScore(true)
                setSuccess(true)
            } else {
                alert(response.data.message)
                throw new Error(response.data.message)
            }
        }).catch((error) => console.error(`[RESOLVE KATA ERROR]: Something wrong: ${error}`))
    }

    const pullData = () => {
        setReload(!reload)
    }

    const getSolution = (data: any) => {
        setSolution(data)
    }

    return (
        <div>
            {kata ?
                <div>
                    <Paper sx={{ padding: '20px' }}>
                        {
                            userName === kata.creator ?
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ width: '100%' }} />
                                    <h1 style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        Details of the kata:
                                    </h1>
                                    <div style={{ display: 'flex', justifyContent: 'end', alignSelf: 'center', width: '100%' }}>
                                        <DialogMain
                                            iconButton={<EditIcon />}
                                            title={kata.name + ':'}
                                            content={<EditKataForm kata={kata} />}
                                            func={pullData}
                                        />
                                        <DialogMain
                                            iconButton={<HighlightOffIcon />}
                                            colorButton='error'
                                            content={<DeleteForm data={kata} type='kata' />}
                                            func={pullData}
                                        />
                                    </div>
                                </div>
                                :
                                <h1 style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                    Details of the kata:
                                </h1>
                        }
                        <h2>name: {kata.name}</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ flexBasis: '15%' }}>
                                <h3>Rating: {kata.stars}/5</h3>
                                <h3>Level: {kata.level}</h3>
                            </div>
                            <div style={{ flexBasis: '15%' }}>
                                <h3>intents: {kata.intents}</h3>
                                <h3>Creator: {kata.creator}</h3>
                            </div>
                        </div>
                        <h3>Description: </h3>
                        <Typography variant="body1" gutterBottom sx={{ padding: '0 100px 0 100px' }}>
                            {kata.description}
                        </Typography>
                    </Paper>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                        <Tooltip title={!score ? "You need to solve the kata to see the solution" : ""}>
                            <span>
                                <Button
                                    variant={showSolution ? 'contained' : 'outlined'}
                                    size='small'
                                    onClick={() => setShowSolution(!showSolution)}
                                    disabled={!score}
                                >
                                    {showSolution ? 'Show Solution' : 'Hide Solution'}
                                </Button>
                            </span>
                        </Tooltip>
                        <Button
                            variant={showResolve ? 'contained' : 'outlined'}
                            size='small'
                            onClick={() => setshowResolve(!showResolve)}
                            sx={{ ml: '30px' }}
                        >
                            {showResolve ? 'Resolve' : 'Hide'}
                        </Button>
                        {
                            score ?
                                <Formik
                                    initialValues={{ stars: "1" }}
                                    validationSchema={Yup.object().shape(
                                        {
                                            stars: Yup.string()
                                                .oneOf(['1', '2', '3', '4', '5'])
                                                .required('Field is required'),
                                        }
                                    )}
                                    onSubmit={async (values) => {
                                        await scoreKataByID(loggedIn, id!, values.stars).then((response: AxiosResponse) => {
                                            if (response.status === 200) {
                                                setSuccess(true)
                                                setReload(!reload)
                                            } else {
                                                throw new Error('Error in updated Kata')
                                            }
                                        }).catch((error) => console.error(`[UPDATE KATA ERROR]: Something wrong: ${error}`))
                                    }}
                                >
                                    {
                                        ({ values, submitForm, isSubmitting }) =>
                                        (
                                            <Form>
                                                <Container component="main">
                                                    <CssBaseline />
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Grid>
                                                            <Field
                                                                component={Select}
                                                                required
                                                                fullWidth
                                                                id="stars"
                                                                label="stars"
                                                                name="stars"
                                                                type="text"
                                                            >
                                                                <MenuItem value="1">1</MenuItem>
                                                                <MenuItem value="2">2</MenuItem>
                                                                <MenuItem value="3">3</MenuItem>
                                                                <MenuItem value="4">4</MenuItem>
                                                                <MenuItem value="5">5</MenuItem>
                                                            </Field>
                                                        </Grid>
                                                        <Button
                                                            variant="contained"

                                                            disabled={isSubmitting}
                                                            onClick={submitForm}
                                                            sx={{ ml: '5px' }}
                                                        >
                                                            Score
                                                        </Button>
                                                    </Box>
                                                </Container>
                                            </Form>
                                        )
                                    }
                                </Formik>
                                :
                                null
                        }
                    </div>
                    {
                        success ?
                            <Alert
                                severity="success"
                                sx={{
                                    display: 'flex',
                                    justifyContents: 'center',
                                    mt: '20px',
                                    width: '500px'
                                }}
                                onClose={() => { setSuccess(false) }}
                            >
                                <AlertTitle>Success</AlertTitle>
                                Submit correctly
                            </Alert>
                            :
                            null
                    }
                    <Grid container justifyContent="center">
                        <Grid item xs={12} sm={4} >
                            {showSolution ? null : <NewEditor codeSolution={kata?.solution} />}
                        </Grid>
                    </Grid>
                </div>
                :
                <CircularProgress />
            }

            {/* Editor to Resolve Kata */}
            {showResolve ?
                null
                :
                <Container component="main" maxWidth="sm">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Grid container direction="column" justifyContent="center" textAlign="center">
                            <Grid item xs={12} sm={6}>
                                <NewEditor
                                    func={getSolution}
                                    codeSolution=''
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={resolveKata}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            }
        </div>
    )
}