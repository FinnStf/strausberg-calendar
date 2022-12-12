import AuthContext from "./auth-context";
import {useCallback, useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import firebaseApp from "../firebase";

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime()
    const adjustedExpirationTime = new Date(expirationTime).getTime()
    const remainingDuration = adjustedExpirationTime - currentTime
    return remainingDuration
}
let logoutTimer;
const retrieveStoredSessionData = () => {
    const storedUsername = localStorage.getItem('username')
    const storedToken = localStorage.getItem('token')
    const storedExpirationTime = localStorage.getItem('expirationTime')
    const remainingTime = calculateRemainingTime(storedExpirationTime)
    if (remainingTime <= 3600) {
        localStorage.removeItem('username')
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        return null
    }
    return {
        username:storedUsername,
        token: storedToken,
        duration: remainingTime
    }
}

function AuthContextProvider(props) {
    const auth = getAuth(firebaseApp)
    useEffect(()=>{

    },[auth])
    const tokenData = retrieveStoredSessionData()
    let initialToken;
    let initialUsername;
    if (tokenData) {
        initialToken = tokenData.token
        initialUsername = tokenData.username
    }

    const [token, setToken] = useState(initialToken)
    const [username, setUsername] = useState(initialUsername)
    const userIsLoggedIn = !!token;

    const logOutHandler = useCallback(() => {
        setToken(null)
        localStorage.removeItem('username')
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        if (logoutTimer) {
            clearTimeout(logoutTimer)
        }
    }, [])


    const logInHandler = (token, expirationTime) => {
        setToken(token)
        setUsername(auth.currentUser.displayName)
        localStorage.setItem('username', auth.currentUser.displayName)
        localStorage.setItem('token', token)
        localStorage.setItem('expirationTime', expirationTime)
        const remainingTime = calculateRemainingTime(expirationTime)
        logoutTimer = setTimeout(logOutHandler, remainingTime)
    }
    useEffect(() => {
        if (tokenData) {
            logoutTimer = setTimeout(logOutHandler, tokenData.duration)
        }
    }, [tokenData, logOutHandler])

    const authCtxValue = {
        username: username,
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: logInHandler,
        logout: logOutHandler,
    }
    return (
        <AuthContext.Provider value={authCtxValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider