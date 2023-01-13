import React from "react";

const EmployeeContext = React.createContext({
    employees: [],
    loggedInEmployee: {},
    addEmployee: (localId, surname, lastname)=>{},
    setLoggedInEmployee:(localId)=>{},
    addShift:(employee, eventId, eventStart, eventEnd) =>{},
    removeShift:(employee, shiftId)=>{},
    updateShift:(employee, shiftId, start, end, pause)=>{}
})
export default EmployeeContext