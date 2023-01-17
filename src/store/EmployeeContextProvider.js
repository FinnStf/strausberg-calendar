import EmployeeContext from "./employee-context";
import {collection, doc, getDocs, addDoc, updateDoc} from "firebase/firestore";
import {firestore} from "../firebase";
import {useCallback, useEffect, useReducer} from "react";

let defaultEmployeeState = {
    employees: [],
    loggedInEmployee: {}
}
const insertShiftChronically = (newShift, shifts) => {
    const newShiftDate = new Date(newShift.start)
    const index = shifts.findIndex(shift => new Date(shift.start) < newShiftDate)
    if (index===-1){
        shifts.push(newShift)
    }else{
        shifts.splice(index, 0, newShift)
    }
    return shifts
}

const employeeStateReducer = (state, action) => {
    if (action.type === 'SET') {
        return {...state, employees: action.employees}
    }
    if (action.type === 'ADD') {
        const updatedEmployees = [...state.employees]
        updatedEmployees.push(action.newEmployee)
        return {...state, employees: updatedEmployees}
    }
    if (action.type === 'SET_LOGGEDIN_EMPLOYEE') {
        if (action.localId) {
            const selectedEmployeeIndex = state.employees.findIndex((obj) => obj.authId === action.localId)
            const selectedEmployee = state.employees[selectedEmployeeIndex]
            return {...state, loggedInEmployee: selectedEmployee}
        } else {
            return {...state, loggedInEmployee: {}}
        }
    }
    if (action.type === 'ADD_SHIFT' || action.type === 'REMOVE_SHIFT' || action.type === 'UPDATE_SHIFT') {
        let updatedShifts;
        const updatedEmployees = [...state.employees]
        const employeeIndex = updatedEmployees.findIndex(employee => employee.authId === action.employee.authId)
        const updatedEmployee = updatedEmployees[employeeIndex]
        if (action.type === 'ADD_SHIFT') {
            updatedShifts = [...updatedEmployee.shifts]
            //only push shift element if it hasnt been added yet
            if (updatedShifts.filter(shift => shift.id === action.shift.id).length <= 0) {
                insertShiftChronically(action.shift, updatedShifts)
            }
        } else if (action.type === 'REMOVE_SHIFT') {
            updatedShifts = updatedEmployee.shifts.filter(shift => shift.id !== action.shiftId)
        } else if (action.type === 'UPDATE_SHIFT') {
            const updatedShiftIndex = updatedEmployee.shifts.findIndex(shift => shift.id === action.updatedShift.id)
            updatedShifts = [...updatedEmployee.shifts]
            updatedShifts[updatedShiftIndex] = action.updatedShift
        }
        updatedEmployee.shifts = updatedShifts
        updatedEmployees[employeeIndex] = updatedEmployee
        return {...state, employees: updatedEmployees}
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
    }, [employeeCollectionRef]);

    useEffect(() => {
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
        const newEmployee = {authId: localId, surname: surname, lastname: lastname, isAdmin: false, shifts: []}
        const docRef = await addDoc(employeeCollectionRef, newEmployee);
        const localEmployeeObj = {...newEmployee, id: docRef.id}
        dispatchEmployeeState({type: 'ADD', newEmployee: localEmployeeObj})
    }
    const setLoggedInEmployee = (localId) => {
        localStorage.setItem('localId', localId)
        dispatchEmployeeState({type: 'SET_LOGGEDIN_EMPLOYEE', localId: localId})
    }
    const addShift = async (employee, eventId, eventStart, eventEnd) => {
        const newShift = {id: eventId, start: eventStart, end: eventEnd, pause: 0}
        let shifts = []
        if (employee.shifts) {
            shifts = [...employee.shifts]
        }
        shifts = insertShiftChronically(newShift, shifts)
        const employeeDoc = doc(firestore, "employee", employee.id);
        await updateDoc(employeeDoc, {shifts: shifts});
        dispatchEmployeeState({type: 'ADD_SHIFT', shift: newShift, employee: employee})
    }
    const removeShift = async (employee, eventId) => {
        let shifts = []
        if (employee.shifts) {
            shifts = [...employee.shifts]
        }
        const updatedShifts = shifts.filter(shift => eventId !== shift.id)
        const employeeDoc = doc(firestore, "employee", employee.id);
        await updateDoc(employeeDoc, {shifts: updatedShifts});
        dispatchEmployeeState({type: 'REMOVE_SHIFT', shiftId: eventId, employee: employee})
    }
    const removeAllShifts = async (eventId, assignedEmployees) => {
      assignedEmployees.map(employee => {
          const index = employeeState.employees.findIndex(stateEmployee=>employee.authId===stateEmployee.authId)
          removeShift(employeeState.employees[index], eventId)
      })
    }
    const updateShift = async (employee, shiftId, start, end, pause) => {
        const newShiftObj = {id: shiftId, start: start, end: end, pause: pause}
        const updatedShifts = employee.shifts.map(shift => {
            if (shift.id === shiftId) {
                return newShiftObj
            } else {
                return shift
            }
        })
        const employeeDoc = doc(firestore, "employee", employee.id);
        await updateDoc(employeeDoc, {shifts: updatedShifts});
        dispatchEmployeeState({type: 'UPDATE_SHIFT', updatedShift: newShiftObj, employee: employee})
    }
    const employeeCtx = {
        employees: employeeState.employees,
        loggedInEmployee: employeeState.loggedInEmployee,
        addEmployee: addEmployee,
        setLoggedInEmployee: setLoggedInEmployee,
        addShift: addShift,
        removeShift: removeShift,
        removeAllShifts:removeAllShifts,
        updateShift: updateShift
    }
    return (
        <EmployeeContext.Provider value={employeeCtx}>
            {props.children}
        </EmployeeContext.Provider>
    )
}

export default EmployeeContextProvider;