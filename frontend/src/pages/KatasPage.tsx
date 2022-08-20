import { Button, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { AxiosResponse } from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useSessionStorage } from "../hooks/useSessionStorage"
import { getAllKatas } from "../services/katasService"
import { Kata } from "../utils/types/Kata.types"

export const KatasPage = () => {

    const [katas, setKatas] = useState<Kata[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const loggedIn = useSessionStorage('sessionJWTToken')
    const navigate = useNavigate()

    useEffect(() => {
        if (!loggedIn) {
            return navigate('/login')
        } else {
            getAllKatas(loggedIn, 5, currentPage).then((response: AxiosResponse) => {
                if (response.status === 200 && response.data.katas && response.data.totalPages && response.data.currentPage) {
                    const { katas, totalPages, currentPage } = response.data
                    setKatas(katas)
                    setTotalPages(totalPages)
                } else {
                    throw new Error(`Error obtaining katas: ${response.data}`)
                }
            }).catch((error) => console.log(`[Get All Katas Error]: ${error}`))
        }
    }, [loggedIn, currentPage])

    return (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', width: '70%' }}>
                <h1>
                    Katas:
                </h1>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#1976d2', color: 'white'}}>
                                <TableCell align="center" sx={{ color: 'white'}}>Name</TableCell>
                                <TableCell align="center" sx={{ color: 'white'}}>Level</TableCell>
                                <TableCell align="center" sx={{ color: 'white'}}>Starts</TableCell>
                                <TableCell align="center" sx={{ color: 'white'}}>Creator</TableCell>
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
                                    <TableCell align="center"><Button variant="contained" onClick={() => navigate(`/katas/${kata._id}`)}>Details</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ display: 'flex', margin: '20px 0 20px 0', width: '100%', justifyContent: 'center' }}>
                    <Pagination count={totalPages} onChange={(e, page) => setCurrentPage(page)} color="primary" variant="outlined" shape="rounded" />
                </div>
                <Button sx={{ mt: '40px' }} variant="contained" onClick={() => navigate(`/katas/create`)}>Create Kata</Button>
            </div>
        </div>
    )
}