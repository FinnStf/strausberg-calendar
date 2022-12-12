import {ListGroup} from "react-bootstrap";
import Button from "../UI/Button";
import styles from "./EmployeeList.module.css";
import {useContext, useEffect, useState} from "react";
import employeeContext from "../../store/employee-context";
import eventContext from "../../store/event-context";

function EmployeeList(props) {
    const assignedEmployees = props.assignedEmployees
    const employees = useContext(employeeContext).employees
    const eventCtx = useContext(eventContext)
    const [employeeSelection, setEmployeeSelection] = useState([])
    const [selectedEmployee, setSelectedEmployee] = useState({})

    useEffect(() => {
        const notAssignedEmployees = employees.filter((employee) => {
            return assignedEmployees.findIndex((element) => element.id === employee.id) === -1
        })
        setEmployeeSelection(notAssignedEmployees)
        setSelectedEmployee({id: -1})

    }, [assignedEmployees, employees])


    const handleEmployeeSelection = (event) => {
        const selectedEmployeeId = event.target.value
        const selectedEmployeeIndex = employeeSelection.findIndex((employee) => employee.id === selectedEmployeeId)
        const selectedEmployee = employeeSelection[selectedEmployeeIndex]
        setSelectedEmployee(selectedEmployee)
    }
    const handleAssignEmployee = () => {
        if (selectedEmployee.id === -1) {
            eventCtx.assignEmployee(employeeSelection[0])
        } else {
            eventCtx.assignEmployee(selectedEmployee)
        }
    }
    const handleRemoveEmployeeAssignment = (employeeId) => {
        eventCtx.removeAssignedEmployee(employeeId)
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
                            <Button handleClick={() => handleRemoveEmployeeAssignment(employee.id)}
                                    className='delete-button'>
                                Remove
                            </Button>
                        </div>
                    </ListGroup.Item>
                )}
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
            </ListGroup>
        </div>
    )
}

export default EmployeeList;