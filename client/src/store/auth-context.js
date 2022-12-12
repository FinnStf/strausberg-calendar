import React from "react";

const AuthContext = React.createContext({
    username: '',
    token:'',
    isLoggedIn:false,
    login:(token)=>{},
    logout:()=>{},
})

export default AuthContext