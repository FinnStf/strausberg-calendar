import EmployeeContext from "./employee-context";
import {collection, deleteDoc, doc, getDocs, addDoc, updateDoc} from "firebase/firestore";
import {firestore} from "../firebase";
import {useCallback, useEffect, useReducer} from "react";

let defaultEmployeeState = {
    employees : [],
    loggedInEmployee:{}
}
const employeeStateReducer = (state, action) =>{
    if (action.type === 'SET') {
        return {...state, employees: action.employees}
    }
    if(action.type ==='ADD'){
        const updatedEmployees = [...state.employees]
        updatedEmployees.push(action.newEmployee)
        return {...state, employees: updatedEmployees}
    }
    if(action.type ==='SET_LOGGEDIN_EMPLOYEE'){
        if (action.localId){
            const selectedEmployeeIndex = state.employees.findIndex((obj) => obj.authId === action.localId)
            const selectedEmployee = state.employees[selectedEmployeeIndex]
            return {...state, loggedInEmployee: selectedEmployee}
        }else{
            return {...state, loggedInEmployee: {}}
        }
    }
    return defaultEmployeeState
}

function EmployeeContextProvider(props) {
    const employeeCollectionRef = collection(firestore, "employee");
    const [employeeState, dispatchEmployeeState] = useReducer(employeeStateReducer, defaultEmployeeState)

    const fetchEmployees = useCallback(async () => {
        const data = await getDocs(employeeCollectionRef);
        const employeeData = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
        if (employeeData.length > 0) {
            dispatchEmployeeState({type: 'SET', employees: employeeData})
        }
    },[employeeCollectionRef]);

    useEffect( () => {
        async function fetchData() {
            await fetchEmployees()
            const storedUserId = localStorage.getItem('localId')
            if (storedUserId) {
                dispatchEmployeeState({type: 'SET_LOGGEDIN_EMPLOYEE', localId: storedUserId})
            }
        }
      fetchData()
    }, []);


    const addEmployee = async (localId, surname, lastname) => {
        const newEmployee = {authId: localId, surname: surname, lastname:lastname, isAdmin:false}
        const docRef = await addDoc(employeeCollectionRef, newEmployee);
        const localEmployeeObj = {...newEmployee, id: docRef.id}
        dispatchEmployeeState({type: 'ADD', newEmployee: localEmployeeObj})
    }
    const setLoggedInEmployee = (localId) => {
        localStorage.setItem('localId',localId)
        dispatchEmployeeState({type: 'SET_LOGGEDIN_EMPLOYEE', localId: localId})
    }

    const employeeCtx = {
        employees: employeeState.employees,
        loggedInEmployee: employeeState.loggedInEmployee,
        addEmployee:addEmployee,
        setLoggedInEmployee:setLoggedInEmployee
    }
    return (
        <EmployeeContext.Provider value={employeeCtx}>
            {props.children}
        </EmployeeContext.Provider>
    )
}

export default EmployeeContextProvider;