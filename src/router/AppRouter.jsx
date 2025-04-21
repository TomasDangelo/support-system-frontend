import { Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from '../components/ProtectedRoute';
import TicketDetail from '../components/TicketDetail';
import UserAdmin from '../components/UserAdmin';
const AppRouter = () => {

    return(
            <Routes>
                <Route path="*" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={ 
                        <DashboardPage /> 
                    //<ProtectedRoute>  --> envolver dashboard, useradmin y ticketdetail una vez se termine la app
                    //</ProtectedRoute>
                } />
                <Route path='/tickets/:id' element={<TicketDetail/>}/>
                <Route path='/admin/users' element={<UserAdmin/>}/>
            </Routes>

    )
}

export default AppRouter;