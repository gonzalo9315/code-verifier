import { ReactNode } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

interface Props {
    // children?: ReactNode,
    role: string
}

export const ProtectedRoute = ({ ...props }: Props) => {

    const roleUser: any = sessionStorage.getItem('role')
    if(!roleUser) return <Navigate to="/" />
    return roleUser !== props.role ? <Navigate to="/" /> : <Outlet /> 
}