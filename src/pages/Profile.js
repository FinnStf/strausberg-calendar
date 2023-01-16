import {useContext, useEffect, useState} from "react";
import EmployeeContext from "../store/employee-context";
import ShiftTable from "../components/Profile/ShiftTable"
import Card from "../components/UI/Card";

export default function Profile() {
    const employeeCtx = useContext(EmployeeContext)
    const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(0)
    const selectedEmployee = employeeCtx.loggedInEmployee

    useEffect(() => {
        const employeeIndex = employeeCtx.employees.findIndex(employee => employee.authId === selectedEmployee.authId)
        if (employeeIndex !== -1)
            setSelectedEmployeeIndex(employeeIndex)
    }, [employeeCtx.employees, selectedEmployee.authId])

    //TODO if admin select employee from selection

    //TODO Display for work hours this month

    return (
        <Card>
            <h2>{employeeCtx.loggedInEmployee.surname} {employeeCtx.loggedInEmployee.lastname}</h2>
            {employeeCtx.employees.length > 0 &&
            <ShiftTable employeeCtx={employeeCtx} employee={employeeCtx.employees[selectedEmployeeIndex]}/>
            }
        </Card>
    )
}