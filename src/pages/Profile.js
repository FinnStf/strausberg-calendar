import {useContext} from "react";
import EmployeeContext from "../store/employee-context";
import ShiftTable from "../components/Profile/ShiftTable"
import Card from "../components/UI/Card";

export default function Profile() {
    const employeeCtx = useContext(EmployeeContext)
    const employee = employeeCtx.loggedInEmployee

    //TODO employee has to be from employeeCtx.employees since there the data changes dynamically
    //TODO if admin select employee from selection

    //TODO Display for work hours this month

    return (
        <Card>
            <h2>{employeeCtx.loggedInEmployee.surname} {employeeCtx.loggedInEmployee.lastname}</h2>
            <ShiftTable employeeCtx={employeeCtx} employee={employee} shifts={employee.shifts}/>
        </Card>
    )
}