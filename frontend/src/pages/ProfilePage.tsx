import { CircularProgress, Paper } from "@mui/material"
import { AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { UserForm } from "../components/forms/UserForm"
import { useSessionStorage } from "../hooks/useSessionStorage"
import { getProfile } from "../services/authService"



export const ProfilePage = () => {
    
    const loggedIn = useSessionStorage('sessionJWTToken')
    const [user, setUser] = useState(undefined)
    const [reload, setReload] = useState(false)

    useEffect(() => {
      getProfile(loggedIn).then((response: AxiosResponse) => {
        setUser(response.data)
      })
    }, [reload])
    

    return (
        <Paper sx={{padding: '40px'}}>
            <h1 style={{marginBottom: '50px'}}>Profile Info:</h1>
            {
                user ?
                    <UserForm user={user}/>
                :
                    <CircularProgress />
            }
        </Paper>
    )
}