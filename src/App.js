import Header from "./components/Layout/Header";
import { useContext } from "react";
import Calendar from "./components/Calendar/Calendar";
import Profile from "./pages/Profile";
import CreateUser from './components/Login/CreateUser';
import ResetPassword from './components/Login/ResetPassword';
import SignIn from './components/Login/SignIn';
import EmployeeContextProvider from "./store/EmployeeContextProvider";
import EventContextProvider from "./store/EventContextProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, Navigate } from "react-router-dom";
import AuthContext from "./store/auth-context";
import Login from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
    const authCtx = useContext(AuthContext)
    const loggedInRoutes =
        <Routes>
            <Route path='/' element={<Calendar />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='*' element={<NotFoundPage />} />
        </Routes>

    const loggedOutRoutes =
        <Routes>
            <Route path='/login' element={<Login />}>
                <Route index element={<SignIn />} />
                <Route path='create-user' element={<CreateUser />} />
                <Route path='reset-pwd' element={<ResetPassword />} />
            </Route>
            <Route path='*' element={<Navigate to={'/login'} />} />
        </Routes>

    return (
        <EmployeeContextProvider>
            <EventContextProvider>
                <Header />
                <main>
                    {authCtx.isLoggedIn ? loggedInRoutes : loggedOutRoutes}
                    {/*loggedInRoutes*/}
                </main>
            </EventContextProvider>
        </EmployeeContextProvider>
    );
}

export default App;
