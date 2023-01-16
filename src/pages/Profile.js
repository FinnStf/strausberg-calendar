import {useContext, useEffect, useState} from "react";
import EmployeeContext from "../store/employee-context";
import ShiftTable from "../components/Profile/ShiftTable"
import Card from "../components/UI/Card";
import {FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Input from "../components/UI/Input";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export default function Profile() {
    const employeeCtx = useContext(EmployeeContext)
    const [selectedEmployee, setSelectedEmployee] = useState({authId: ''})
    const [monthFilter, setMonthFilter] = useState(`${new Date().getFullYear()}-${new Date().toLocaleString("default", { month: "2-digit" })}`)
    const [time, setTime] = useState()

    useEffect(() => {
        if (employeeCtx.loggedInEmployee && employeeCtx.loggedInEmployee.authId) {
            setSelectedEmployee(employeeCtx.loggedInEmployee)
        }
    }, [employeeCtx.loggedInEmployee])

    useEffect(() => {
        if (selectedEmployee&&selectedEmployee.shifts)
        setTime(getTimeWorked())
    }, [selectedEmployee, selectedEmployee.shifts, monthFilter])

    const handleChange = (event) => {
        if (event.target.value !== '') {
            const employeeIndex = employeeCtx.employees.findIndex(employee => employee.authId === event.target.value)
            setSelectedEmployee(employeeCtx.employees[employeeIndex]);
        } else {
            setSelectedEmployee({authId: ''})
        }
    };
    const handleFilterMonth = (event) => {
    setMonthFilter(event.target.value)
    }
    const getTimeWorked = () =>{
        const date = new Date(monthFilter)
        const month = date.getMonth()
        const timeWorked = selectedEmployee.shifts
            .filter(shift => new Date(shift.start).getMonth() === month)
            .reduce((total, shift) => {
            const startDate = new Date(shift.start)
            const endDate = new Date(shift.end)
            const time = (endDate - startDate)/60000 - shift.pause
            return total + time
        },0)
        return timeWorked
    }
    return (
        <Card>
            <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                    <Typography
                        sx={{mt: 0.5}}
                        color="text.secondary"
                        display="block"
                        variant="caption"
                    >
                        Mitarbeiter
                    </Typography>
                <h3>{selectedEmployee.surname} {selectedEmployee.lastname}</h3>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Typography
                        sx={{mt: 0.5}}
                        color="text.secondary"
                        display="block"
                        variant="caption"
                    >
                        Arbeitszeit (im Monat)
                    </Typography>
                    <h3>{time} min</h3>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Input styles='filter' label="Monat" input={{type: "month", value:monthFilter, onChange: handleFilterMonth}}/>
                </Grid>
                {(employeeCtx.loggedInEmployee && employeeCtx.loggedInEmployee.isAdmin) &&
                <Grid item xs={6} sm={3}>
                    <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="employee-selection">Name</InputLabel>
                        <Select
                            labelId="employee-selection"
                            id="demo-simple-select-standard"
                            value={selectedEmployee.authId}
                            onChange={handleChange}
                            label="Age"
                        >
                            <MenuItem value=''>None</MenuItem>
                            {employeeCtx.employees.map(employee =>
                                <MenuItem key={`employee_${employee.authId}`} value={employee.authId}>
                                    {employee.surname}
                                </MenuItem>
                            )}
                        </Select>

                    </FormControl>
                </Grid>
                }
            </Grid>
            {employeeCtx.employees.length > 0 &&
            <ShiftTable employeeCtx={employeeCtx} employee={selectedEmployee} monthFilter={monthFilter}/>
            }
        </Card>
    )
}