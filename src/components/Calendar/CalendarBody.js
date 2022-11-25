import {useContext} from "react";
import styles from './CalendarBody.module.css'
import CalendarDate from "./CalendarDate";
import CalendarContext from "../../store/calendar-context";
import EmployeeContext from "../../store/employee-context";
import {getNumberOfDaysOfMonth} from "../../logic/calendar-logic";

function CalendarBody() {
    //Calendar Data
    const calendarCtx = useContext(CalendarContext)
    const tableHeaders = calendarCtx.tableDates.map((date) => <CalendarDate date={date}/>)
    //Employee Data
    const employeeCtx = useContext(EmployeeContext)
    const numDaysOfSelectedMonth = getNumberOfDaysOfMonth(calendarCtx.currentDate)
    console.log(numDaysOfSelectedMonth)
    const tableData = employeeCtx.shifts.map((employee) => {
        const name = <td>{employee.surname}</td>
        const shifts = []
        for (let i = 0; i < numDaysOfSelectedMonth; i++) {
            shifts[i] = <td className={styles["calendar-slot"]}></td>
        }
        for (let i = 0; i < employee.shift.length; i++) {
            if (employee.shift[i].getMonth() === calendarCtx.currentDate.getMonth()) {
                let shiftDate = employee.shift[i].getDate()
                shifts[shiftDate] = <td className={styles["calendar-slot"]}>X</td>
            }
        }
        return <tr>{[name, ...shifts]}</tr>
    })
    return (
        <table>
            <tr className={styles['table-headers']}>
                <th></th>
                {tableHeaders}
            </tr>
            {tableData}

        </table>
    )
}

export default CalendarBody;