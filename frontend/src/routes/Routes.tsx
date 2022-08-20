import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { KatasPage } from '../pages/KatasPage';
import { KatasDetailPage } from '../pages/KatasDetailPage';
import { CreateKataPage } from '../pages/CreateKataPage';
import { MisKatasPage } from '../pages/MisKatasPage';
import { ProtectedRoute } from '../services/guard/ProtectedRoute';
import { CrudPage } from '../pages/CrudPage';
import { ProfilePage } from '../pages/ProfilePage';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/login' element={<LoginPage/>}></Route>
            <Route path='/register' element={<RegisterPage/>}></Route>
            <Route element={<ProtectedRoute role='user'/>}>
                <Route path='/katas' element={<KatasPage/>}></Route>
                <Route path='/katas/:id' element={<KatasDetailPage/>}></Route>
                <Route path='/katas/create' element={<CreateKataPage/>}></Route>
                <Route path='/mis_katas' element={<MisKatasPage/>}></Route>
                <Route path='/profile' element={<ProfilePage/>}></Route>
            </Route>
            <Route element={<ProtectedRoute role='admin'/>}>
                <Route path='/crud' element={<CrudPage/>}></Route>
            </Route>
            <Route path='*' element={<Navigate to='/' replace/>}></Route>
        </Routes>        
    )
}
