import {ListGroup} from "react-bootstrap";
import Button from "../UI/Button";
import styles from "./EmployeeList.module.css";
import {useContext, useEffect, useState} from "react";
import EmployeeContext from "../../store/employee-context";
import eventContext from "../../store/event-context";

function EmployeeList(props) {
    const assignedEmployees = props.assignedEmployees
    const employees = useContext(EmployeeContext).employees
    const employeeCtx = useContext(EmployeeContext)
    const loggedInEmployee = employeeCtx.loggedInEmployee
    const eventCtx = useContext(eventContext)
    const [employeeSelection, setEmployeeSelection] = useState([])
    const [selectedEmployee, setSelectedEmployee] = useState({})
    const [loggedInEmployeeAssigned, setLoggedInEmployeeAssigned] = useState(false)
    const [assignmentError, setAssignmentError] =useState(false)
    useEffect(() => {
        const notAssignedEmployees = employees.filter((employee) => {
            return assignedEmployees.findIndex((element) => element.id === employee.id) === -1
        })
        //check if logged in user is already assigned
        setLoggedInEmployeeAssigned(assignedEmployees.filter((employee)=> loggedInEmployee.id === employee.id).length>0)
        setEmployeeSelection(notAssignedEmployees)
        setSelectedEmployee({id: -1})

    }, [loggedInEmployee.id, assignedEmployees, employees])


    const handleEmployeeSelection = (event) => {
        const selectedEmployeeId = event.target.value
        const selectedEmployeeIndex = employeeSelection.findIndex((employee) => employee.id === selectedEmployeeId)
        const selectedEmployee = employeeSelection[selectedEmployeeIndex]
        setSelectedEmployee(selectedEmployee)
    }
    const handleAssignEmployee = () => {
        if (props.event.extendedProps.id){

        let employee;
        if (selectedEmployee.id === -1) {
            employee = employeeSelection[0]
        } else {
            employee = selectedEmployee
        }
        eventCtx.assignEmployee(employee)
        //update employee document by adding shift to employee database
        employeeCtx.addShift(employee, props.event.extendedProps.id, props.event.start, props.event.end)
        }else{
            setAssignmentError(true)
        }
    }
    const handleAssignLoggedInEmployee = () => {
        if (props.event.extendedProps.id){
        setLoggedInEmployeeAssigned(true)
        eventCtx.assignEmployee(loggedInEmployee)
        //update employee document by adding shift to employee database
        employeeCtx.addShift(loggedInEmployee, props.event.extendedProps.id, props.event.start, props.event.end)
        }else{
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
                                    className="d-flex justify-content-between align-items-start">
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
                                    className="d-flex justify-content-between align-items-start">
                        {employeeSelection.length > 0 && <div className={styles['select-container']}>
                            <select onChange={handleEmployeeSelection}>
                                {employeeSelection.map((assignedEmployee, index) =>
                                    <option key={`employee_option_${index}`}
                                            value={assignedEmployee.id}>{assignedEmployee.surname} {assignedEmployee.name}</option>)}
                            </select>
                            <button onClick={handleAssignEmployee}>Hinzufügen</button>
                        </div>}
                    </ListGroup.Item>
                    :
                    <ListGroup.Item as='li' style={{padding: '0px', minHeight:'3.5rem'}}
                                    className="d-flex justify-content-end align-items-start">
                        {loggedInEmployeeAssigned ?
                            <Button className='negative' handleClick={handleRemoveLoggedInEmployee}>Abmelden</Button>
                            :
                            <Button className='positive' handleClick={handleAssignLoggedInEmployee}>Eintragen</Button>
                        }
                    </ListGroup.Item>}
                {assignmentError&&
                <ListGroup.Item as='li' xs={{pr:2, pl:2}} style={{backgroundColor:'rgba(111,23,27,0.5)', minHeight:'3rem'}}
                                className="d-flex justify-content-center align-items-center">
                    <h4 style={{color:'rgb(111,23,27)', marginRight:'1rem'}}>Error: </h4>
                    <p style={{color:'rgb(111,23,27)'}}>Bevor Mitarbeiter zugewiesen werden können, muss vorerst ein Event angelegt werden.</p>
                </ListGroup.Item>}
            </ListGroup>
        </div>
    )
}

export default EmployeeList;