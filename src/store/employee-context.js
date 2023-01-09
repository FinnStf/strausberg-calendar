import React from "react";

const employeeContext = React.createContext({
    employees: [],
    loggedInEmployee: {},
    addEmployee: (localId, surname, lastname)=>{},
    setLoggedInEmployee:(localId)=>{}
})
export default employeeContext