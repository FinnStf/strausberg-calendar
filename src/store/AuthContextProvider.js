import AuthContext from "./auth-context";
import {useCallback, useEffect, useState} from "react";

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime()
    const adjustedExpirationTime = new Date(expirationTime).getTime()
    const remainingDuration = adjustedExpirationTime - currentTime
    return remainingDuration
}
let logoutTimer;
const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token')
    const storedExpirationTime = localStorage.getItem('expirationTime')
    const remainingTime = calculateRemainingTime(storedExpirationTime)
    if (remainingTime <= 3600) {
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        return null
    }
    return{
        token: storedToken,
        duration: remainingTime
    }
}

function AuthContextProvider(props) {
    const firebaseAuth = props.firebaseAuth
    const tokenData = retrieveStoredToken()
    let initialToken;
    if (tokenData){
        initialToken = tokenData.token
    }

    const [token, setToken] = useState(initialToken)
    const userIsLoggedIn = !!token;

    const logOutHandler = useCallback(() => {
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        if (logoutTimer) {
            clearTimeout(logoutTimer)
        }
    }, [])
    const logInHandler = (token, expirationTime) => {
        setToken(token)
        localStorage.setItem('token', token)
        localStorage.setItem('expirationTime', expirationTime)
        const remainingTime = calculateRemainingTime(expirationTime)
        logoutTimer = setTimeout(logOutHandler, remainingTime)
    }
    useEffect(()=>{
        if(tokenData){
            console.log(tokenData.duration)
            logoutTimer = setTimeout(logOutHandler, tokenData.duration)
        }
    }, [tokenData, logOutHandler])

    const authCtxValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: logInHandler,
        logout: logOutHandler
    }
    return (
        <AuthContext.Provider value={authCtxValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider