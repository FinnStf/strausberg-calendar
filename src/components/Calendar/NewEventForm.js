import Modal from "../UI/Modal";
import styles from "./NewEventForm.module.css"
import Button from "../UI/Button";
import Input from "../UI/Input";
import {splitDateTime, concatDateTime} from "../../logic/calendar-transformer";
import {useContext, useEffect, useRef, useState} from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import EmployeeList from "./EmployeeList";
import EmployeeContext from "../../store/employee-context"


function NewEventForm(props) {
    const [userTabIsVisible, setUserTabIsVisible] = useState(false)
    const employeeCtx = useContext(EmployeeContext)
    /*
    Initializing Form
     */
    const title_field = useRef()
    const date_field = useRef()
    const startTime_field = useRef()
    const endTime_field = useRef()
    const neededEmployees_field = useRef()

    let title = 'Neues Event anlegen'
    let submitText = 'Anlegen'
    let deleteButtonIsVisible = false
    if (props.event.extendedProps.id !== '') {
        title = `Event ${props.event.title} bearbeiten`
        submitText = 'Ändern'
        deleteButtonIsVisible = true
    }
    let {date: startDate, time: startTime} = splitDateTime(props.event.start)
    let {time: endTime} = splitDateTime(props.event.end)
    if (!startDate) {
        startDate = props.dateString
    }

    useEffect(() => {
        /*
        populate newEvent Form if User is Admin
         */
        if (employeeCtx.loggedInEmployee && employeeCtx.loggedInEmployee.isAdmin){
            title_field.current.value = props.event.title
            date_field.current.value = startDate
            startTime_field.current.value = startTime
            endTime_field.current.value = endTime
            neededEmployees_field.current.value = props.event.extendedProps.neededEmployees
        }
        /*
        hide the employee assignment tab if eventform is for new event
          */
        if (props.event.extendedProps.id !== '') {
            setUserTabIsVisible(true)
        }
    }, [props.event, startTime, endTime, startDate, employeeCtx.loggedInEmployee.isAdmin])

    /*
    Submit Function
     */
    const onSubmitForm = (event) => {
        event.preventDefault()
        const start = concatDateTime(date_field.current.value, startTime_field.current.value)
        const end = concatDateTime(date_field.current.value, endTime_field.current.value)
        const newEvent = {
            ...props.event, extendedProps: {...props.event.extendedProps}
        }
        newEvent.title = title_field.current.value
        newEvent.start = start
        newEvent.end = end
        newEvent.extendedProps.neededEmployees = neededEmployees_field.current.value
        if (newEvent.extendedProps.id !== '') {
            props.handleUpdateEvent(newEvent)
        } else {
            props.handleAddEvent(newEvent)
        }
    }
    const onDeleteEvent = () => {
        props.handleDeleteEvent(props.event.extendedProps.id)
    }

    return (
        <Modal style={props.style} handleClick={props.onCloseModal}>
            <div className={styles.header}>
                <h2>{title}</h2>
                <Button className='close-button' handleClick={props.onCloseModal}>X</Button>
            </div>
            <div className={styles.body}>
                <Tabs defaultActiveKey="edit-event">
                    {employeeCtx.loggedInEmployee.isAdmin &&
                    <Tab tabClassName={styles['tab-item']} eventKey='edit-event' title='Event Daten'>
                        <form onSubmit={onSubmitForm}>
                            <div className={styles["form-body"]}>
                                <Input label="Name" input={{type: "text", ref: title_field}}/>
                                <Input label="Datum" input={{type: "date", ref: date_field}}/>
                                <Input label="Von" input={{type: "time", ref: startTime_field}}/>
                                <Input label="Bis" input={{type: "time", ref: endTime_field}}/>
                                <Input label="Benötigte Mitarbeiter"
                                       input={{type: "number", ref: neededEmployees_field}}/>
                            </div>
                            <div className={styles.footer}>
                                <Button disabled={!deleteButtonIsVisible} handleClick={onDeleteEvent}
                                        className="negative">Löschen</Button>
                                <Button type="submit" className="positive">{submitText}</Button>
                            </div>
                        </form>
                    </Tab>
                    }
                    {userTabIsVisible &&
                    <Tab tabClassName={styles['tab-item']} eventKey='edit-assignment' title='Mitarbeiter Zuweisung'>
                        <EmployeeList assignedEmployees={props.event.extendedProps.assignedEmployees}></EmployeeList>
                    </Tab>}
                </Tabs>
                    </div>
                    </Modal>
                    )
                }

                export default NewEventForm;