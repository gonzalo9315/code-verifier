import React, { useState } from "react"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import DashboardIcon from '@mui/icons-material/Dashboard'
import BarChartIcon from '@mui/icons-material/BarChart'
import { useNavigate } from "react-router-dom"

export const MenuItems = () => {

    const [role, setRole] = useState(sessionStorage.getItem('role'))
    const navigate = useNavigate()

    return (
        <React.Fragment>
            {
                role === 'user' ?
                        <ListItemButton  onClick={() => navigate('/katas')}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Katas" />
                        </ListItemButton>
                    :
                        null
            }

            {
                role === 'admin' ?
                        <ListItemButton  onClick={() => navigate('/crud')}>
                            <ListItemIcon>
                                <BarChartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Crud" />
                        </ListItemButton>
                    :
                        null
            }
        </React.Fragment>
    )
}