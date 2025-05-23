import { Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from '../components/ProtectedRoute';
import UserAdmin from '../components/UserAdmin';
import TicketDetailPage from '../pages/TicketDetailPage';
import AdminPanel from '../pages/AdminPanel';
import AccountPage from '../pages/AccountPage';
import StatsPage from '../pages/StatsPage';
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
                <Route path='/tickets/:id' element={<TicketDetailPage/>}/>
                <Route path='/admin/users' element={<UserAdmin/>}/>
                <Route path='/profile' element={<AccountPage/>}/>
                <Route path='/stats' element={<StatsPage/>}/>
                <Route path='/admin' element=

             /*   <PrivateRoute roles={['admin']}> 
             envuelve al panel
             </PrivateRoute>*/
                    {<AdminPanel/>}/>
             </Routes> 


    )
}

export default AppRouter;