import { useEffect, useState } from "react"
import { Button, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { User } from "../utils/types/User.types"
import { Kata } from "../utils/types/Kata.types"
import { getAllKatas } from "../services/katasService"
import { useSessionStorage } from "../hooks/useSessionStorage"
import { AxiosResponse } from "axios"
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import EditIcon from '@mui/icons-material/Edit'
import PeopleIcon from '@mui/icons-material/People'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { DialogMain } from "../components/dialog/DialogMain"
import { EditKataForm } from "../components/forms/EditKataForm"
import { DeleteForm } from "../components/forms/DeleteForm"
import { getAllUsers } from "../services/userService"
import { CreateKataForm } from "../components/forms/CreateKataForm"
import { UserForm } from "../components/forms/UserForm"

export const CrudPage = () => {

    const loggedIn = useSessionStorage('sessionJWTToken')
    const [showUsers, setShowUsers] = useState(false)
    const [showKatas, setShowKatas] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [katas, setKatas] = useState<Kata[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [reload, setReload] = useState(false)

    useEffect(() => {

        if (showUsers) {
            loadUsers()
        }
        else if (showKatas) {
            loadKatas()
        }
    }, [currentPage, reload])


    const loadUsers = () => {

        setShowKatas(false)
        setShowUsers(true)

        getAllUsers(loggedIn, 8, currentPage).then((response: AxiosResponse) => {
            if (response.status === 200 && response.data.users && response.data.totalPages && response.data.currentPage) {
                const { users, totalPages, currentPage } = response.data
                setUsers(users)
                setTotalPages(totalPages)
            } else {
                throw new Error(`Error obtaining users: ${response.data}`)
            }
        }).catch((error) => console.log(`[Get All Users Error]: ${error}`))
    }

    const loadKatas = () => {

        setShowUsers(false)
        setShowKatas(true)

        getAllKatas(loggedIn, 8, currentPage).then((response: AxiosResponse) => {
            if (response.status === 200 && response.data.katas && response.data.totalPages && response.data.currentPage) {
                const { katas, totalPages, currentPage } = response.data
                setKatas(katas)
                setTotalPages(totalPages)
            } else {
                throw new Error(`Error obtaining katas: ${response.data}`)
            }
        }).catch((error) => console.log(`[Get All Katas Error]: ${error}`))
    }

    const pullData = () => {
        setReload(!reload)
    }

    return (
        <div>
            <div style={{ margin: '0 0 50px 0' }}>
                <Button
                    variant="contained"
                    onClick={loadUsers}
                    endIcon={<PeopleIcon />}
                    disabled={showUsers}
                >
                    Users
                </Button>
                <Button
                    variant="contained"
                    sx={{ margin: '0 0 0 20px' }}
                    onClick={loadKatas}
                    endIcon={<DashboardIcon />}
                    disabled={showKatas}
                >
                    Katas
                </Button>
            </div>
            {
                showUsers ?
                    <div>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#1976d2', color: 'white' }}>
                                        <TableCell align="center" sx={{ color: 'white' }}>Email</TableCell>
                                        <TableCell align="center" sx={{ color: 'white' }}>Name</TableCell>
                                        <TableCell align="center" sx={{ color: 'white' }}>Age</TableCell>
                                        <TableCell align="center" sx={{ color: 'white' }}>Role</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user: User, index: number) => (
                                        <TableRow
                                            key={user._id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {user.email}
                                            </TableCell>
                                            <TableCell align="center">{user.name}</TableCell>
                                            <TableCell align="center">{user.age}</TableCell>
                                            <TableCell align="center">{user.role}</TableCell>
                                            <TableCell align="center" sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                                <DialogMain
                                                    iconButton={<EditIcon />}
                                                    title={user.name + ':'}
                                                    content={<UserForm user={user} />}
                                                    func={pullData}
                                                />
                                                <DialogMain
                                                    iconButton={<HighlightOffIcon />}
                                                    colorButton='error'
                                                    title={user.name}
                                                    content={<DeleteForm data={user}/>}
                                                    func={pullData}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div style={{ display: 'flex', margin: '20px 0 20px 0', width: '100%', justifyContent: 'center' }}>
                            <Pagination count={totalPages} onChange={(e, page) => setCurrentPage(page)} color="primary" variant="outlined" shape="rounded" />
                        </div>
                        <div style={{ margin: '40px 0 0 0' }}>
                            <DialogMain
                                iconButton={<AddCircleIcon />}
                                colorButton='success'
                                textButton='Create New User'
                                title='Information:'
                                content={<UserForm/>}
                                func={pullData}
                            />
                        </div>
                    </div>
                    :
                    null
            }
            {
                showKatas ?
                    <div>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#1976d2', color: 'white' }}>
                                        <TableCell align="center" sx={{ color: 'white' }}>Name</TableCell>
                                        <TableCell align="center" sx={{ color: 'white' }}>Level</TableCell>
                                        <TableCell align="center" sx={{ color: 'white' }}>Starts</TableCell>
                                        <TableCell align="center" sx={{ color: 'white' }}>Creator</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {katas.map((kata: Kata, index: number) => (
                                        <TableRow
                                            key={kata._id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {kata.name}
                                            </TableCell>
                                            <TableCell align="center">{kata.level}</TableCell>
                                            <TableCell align="center">{kata.stars}</TableCell>
                                            <TableCell align="center">{kata.creator}</TableCell>
                                            <TableCell align="center" sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                                <DialogMain
                                                    iconButton={<EditIcon />}
                                                    title={kata.name + ':'}
                                                    content={<EditKataForm kata={kata} />}
                                                    func={pullData}
                                                />
                                                <DialogMain
                                                    iconButton={<HighlightOffIcon />}
                                                    colorButton='error'
                                                    title={kata.name}
                                                    content={<DeleteForm data={kata} type='kata' />}
                                                    func={pullData}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div
                            style={{
                                display: 'flex',
                                margin: '20px 0 20px 0',
                                width: '100%',
                                justifyContent: 'center'
                            }}
                        >
                            <Pagination
                                count={totalPages}
                                onChange={(e, page) => setCurrentPage(page)}
                                color="primary"
                                variant="outlined"
                                shape="rounded"
                            />
                        </div>
                        <div style={{ margin: '40px 0 0 0' }}>
                            <DialogMain
                                iconButton={<AddCircleIcon />}
                                colorButton='success'
                                textButton='Create new kata'
                                title='Information:'
                                content={<CreateKataForm />}
                                func={pullData}
                            />
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    )
}