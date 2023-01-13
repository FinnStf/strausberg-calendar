import Header from "./components/Layout/Header";
import {Fragment, useContext} from "react";
import Calendar from "./components/Calendar/Calendar";
import Profile from "./pages/Profile";
import EmployeeContextProvider from "./store/EmployeeContextProvider";
import EventContextProvider from "./store/EventContextProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Routes, Navigate} from "react-router-dom";
import AuthContext from "./store/auth-context";
import Login from "./pages/Login";

function App() {
    const authCtx = useContext(AuthContext)
    return (
        <Fragment>
            <Header/>
            <EmployeeContextProvider>
                <EventContextProvider>
                    <main>
                        <Routes>
                            {!authCtx.isLoggedIn && <Route path='/login' element={<Login/>}/>}
                            {!authCtx.isLoggedIn && <Route path='/' element={<Navigate to={'/login'}/>}/>}
                            {authCtx.isLoggedIn && <Route path='/' element={<Calendar/>}/>}
                            {authCtx.isLoggedIn && <Route path='/profile' element={<Profile/>}/>}
                            {!authCtx.isLoggedIn && <Route path='/profile' element={<Navigate to={'/login'}/>}/>}
                        </Routes>
                    </main>
                </EventContextProvider>
            </EmployeeContextProvider>
        </Fragment>
    );
}

export default App;
