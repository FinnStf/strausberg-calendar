import {ListGroup} from "react-bootstrap";
import Button from "../UI/Button";
import styles from "./EmployeeList.module.css";
import {useContext, useEffect, useState} from "react";
import EmployeeContext from "../../store/employee-context";
import eventContext from "../../store/event-context";
import {Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

function EmployeeList(props) {
    const assignedEmployees = props.assignedEmployees
    const employeeCtx = useContext(EmployeeContext)
    const employees = employeeCtx.employees
    const loggedInEmployee = employeeCtx.loggedInEmployee
    const eventCtx = useContext(eventContext)
    const [employeeSelection, setEmployeeSelection] = useState([])
    const [selectedEmployeeId, setSelectedEmployeeId] = useState({})
    const [loggedInEmployeeAssigned, setLoggedInEmployeeAssigned] = useState(false)
    const [assignmentError, setAssignmentError] = useState(false)
    useEffect(() => {
        const notAssignedEmployees = employees.filter((employee) => {
            return assignedEmployees.findIndex((element) => element.id === employee.id) === -1
        })
        if (props.isAdmin && notAssignedEmployees.length > 0) {
            setEmployeeSelection(notAssignedEmployees)
            setSelectedEmployeeId(notAssignedEmployees[0].id)
        } else {
            //check if logged in user is already assigned
            setLoggedInEmployeeAssigned(assignedEmployees.filter((employee) => loggedInEmployee.id === employee.id).length > 0)
        }


    }, [loggedInEmployee.id, assignedEmployees, employees, props.isAdmin])


    const handleAssignEmployee = () => {
        if (props.event.extendedProps.id) {
            const selectedEmployeeIndex = employeeSelection.findIndex((employee) => employee.id === selectedEmployeeId)
            const selectedEmployee = employeeSelection[selectedEmployeeIndex]
            //remove employee from employeeSelection
            setEmployeeSelection((employeeSelection) => {
                employeeSelection.filter(employee => employee.id !== selectedEmployeeId)
            })
            //assign Employee to EventCtx
            eventCtx.assignEmployee(selectedEmployee)
            //update employee document by adding shift to employee database
            employeeCtx.addShift(selectedEmployee, props.event.extendedProps.id, props.event.start, props.event.end)
        } else {
            setAssignmentError(true)
        }
    }
    const handleAssignLoggedInEmployee = () => {
        if (props.event.extendedProps.id) {
            setLoggedInEmployeeAssigned(true)
            eventCtx.assignEmployee(loggedInEmployee)
            //update employee document by adding shift to employee database
            employeeCtx.addShift(loggedInEmployee, props.event.extendedProps.id, props.event.start, props.event.end)
        } else {
            setAssignmentError(true)
        }
    }
    const handleRemoveEmployeeAssignment = (employee) => {
        eventCtx.removeAssignedEmployee(employee)
        //update employee document by removing shift from employee database
        employeeCtx.removeShift(employee, props.event.extendedProps.id)
    }
    const handleRemoveLoggedInEmployee = () => {
        setLoggedInEmployeeAssigned(false)
        eventCtx.removeAssignedEmployee(loggedInEmployee)
        //update employee document by removing shift from employee database
        employeeCtx.removeShift(loggedInEmployee, props.event.extendedProps.id)
    }
    return (
        <div className={styles['employee-list']}>
            <ListGroup as='ol'>
                {props.assignedEmployees.map((employee, index) =>
                    <ListGroup.Item key={`assigned_employee_${index}`} as='li'
                                    className="d-flex justify-content-between align-items-center">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">{index + 1}. {employee.surname} {employee.name}</div>
                        </div>
                        <div className="ms-2">
                            {props.isAdmin &&
                            <Button handleClick={() => handleRemoveEmployeeAssignment(employee)}
                                    className='delete-button'>
                                Remove
                            </Button>
                            }
                        </div>
                    </ListGroup.Item>
                )}
                {props.isAdmin ?
                    <ListGroup.Item as='li' style={{padding: '0px'}}
                                    className="d-flex justify-content-between align-items-center">
                        {(employeeSelection && employeeSelection.length > 0) &&
                        <div className={styles['select-container']}>
                            <Select className={styles['employee-select']} label='Mitarbeiter' value={selectedEmployeeId}
                                    onChange={event => setSelectedEmployeeId(event.target.value)}>
                                {employeeSelection.map((employee, index) =>
                                    <MenuItem key={`employee_option_${index}`}
                                              value={employee.id}>{employee.surname} {employee.name}</MenuItem>)}
                            </Select>
                            <button onClick={handleAssignEmployee}>Hinzufügen</button>
                        </div>}
                    </ListGroup.Item>
                    :
                    <div className={styles['assign-action-container']}>
                        {loggedInEmployeeAssigned ?
                            <Button className='negative'
                                    handleClick={handleRemoveLoggedInEmployee}>Austragen</Button>
                            :
                            <Button className='positive'
                                    handleClick={handleAssignLoggedInEmployee}>Eintragen</Button>
                        }
                    </div>
                }
                {assignmentError &&
                <ListGroup.Item as='li' xs={{pr: 2, pl: 2}}
                                style={{backgroundColor: 'rgba(111,23,27,0.5)', minHeight: '3rem'}}
                                className="d-flex justify-content-center align-items-center">
                    <h4 style={{color: 'rgb(111,23,27)', marginRight: '1rem'}}>Error: </h4>
                    <p style={{color: 'rgb(111,23,27)'}}>Bevor Mitarbeiter zugewiesen werden können, muss vorerst ein
                        Event angelegt werden.</p>
                </ListGroup.Item>}
            </ListGroup>
        </div>
    )
}

export default EmployeeList;