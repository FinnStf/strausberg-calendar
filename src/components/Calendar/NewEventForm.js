import Modal from "../UI/Modal";
import styles from "./NewEventForm.module.css"
import Button from "../UI/Button";
import Input from "../UI/Input";
import {splitDateTime, concatDateTime, getLocalDateString} from "../../logic/calendar-transformer";
import {useContext, useState} from "react";
import EmployeeList from "./EmployeeList";
import EmployeeContext from "../../store/employee-context"
import * as React from "react";
import Box from "@mui/material/Box";
import TabPanel from "../UI/TabPanel";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


function NewEventForm(props) {
    const employeeCtx = useContext(EmployeeContext)
    /*
    State and changehandler for tabs
     */
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let {date: startDate, time: startTime} = splitDateTime(props.event.start)
    if (startTime===""){
        startTime="12:00"
    }
    let {time: endTime} = splitDateTime(props.event.end)
    if (endTime===""){
        endTime="17:00"
    }
    if (!startDate) {
        startDate = props.dateString
    }
    let title = 'Neues Event anlegen'
    let submitText = 'Anlegen'
    let deleteButtonIsVisible = false
    let subtitle = getLocalDateString(startDate)
    const subtitle2 = `(${startTime} bis ${endTime})`
    if (props.event.extendedProps.id !== '') {
        title = `Event ${props.event.title} bearbeiten`
        submitText = 'Ändern'
        deleteButtonIsVisible = true
        if (!employeeCtx.loggedInEmployee.isAdmin){
            title = `Arbeitsplan für ${props.event.title}`
        }
    }
    /*
       Initializing Form
        */
    const [eventTitle, setEventTitle] = useState(props.event.title)
    const [eventDate, setEventDate] = useState(startDate)
    const [eventStartTime, setEventStartTime] = useState(startTime)
    const [eventEndTime, setEventEndTime] = useState(endTime)
    const [neededEmployeeCount, setNeededEmployeeCount] = useState(props.event.extendedProps.neededEmployees)


    /*
    Submit Function
     */
    const onSubmitForm = (event) => {
        event.preventDefault()
        const start = concatDateTime(eventDate, eventStartTime)
        const end = concatDateTime(eventDate, eventEndTime)
        const newEvent = {
            ...props.event, extendedProps: {...props.event.extendedProps}
        }
        newEvent.title = eventTitle
        newEvent.start = start
        newEvent.end = end
        newEvent.extendedProps.neededEmployees = neededEmployeeCount
        if (newEvent.extendedProps.id !== '') {
            props.handleUpdateEvent(newEvent)
        } else {
            props.handleAddEvent(newEvent)
        }
    }
    const onDeleteEvent = () => {
        props.handleDeleteEvent(props.event)
    }

    return (
        <Modal style={props.style} handleClick={props.onCloseModal}>
            {employeeCtx.loggedInEmployee.isAdmin &&
            <>
                <div className={styles.header}>
                    <h2>{title}</h2>
                    <Button className='close-button' handleClick={props.onCloseModal}>X</Button>
                </div>
                <div className={styles.body}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Event Daten"/>
                                <Tab label="Mitarbeiter Zuweisung"/>
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <form onSubmit={onSubmitForm}>
                                <div className={styles["form-body"]}>
                                    <Input label="Name" onChange={event=>setEventTitle(event.target.value)} input={{type: "text", value: eventTitle}}/>
                                    <Input label="Datum" onChange={event=>setEventDate(event.target.value)} input={{type: "date", value: eventDate}}/>
                                    <Input label="Von" onChange={event=>setEventStartTime(event.target.value)} input={{type: "time", value: eventStartTime}}/>
                                    <Input label="Bis" onChange={event=>setEventEndTime(event.target.value)} input={{type: "time", value: eventEndTime}}/>
                                    <Input label="Benötigte Mitarbeiter"
                                           onChange={event=>setNeededEmployeeCount(event.target.value)} input={{type: "number", value: neededEmployeeCount}}/>
                                </div>
                                <div className={styles.footer}>
                                    <Button disabled={!deleteButtonIsVisible} handleClick={onDeleteEvent}
                                            className="negative">Löschen</Button>
                                    <Button type="submit" className="positive">{submitText}</Button>
                                </div>
                            </form>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <EmployeeList
                                assignedEmployees={props.event.extendedProps.assignedEmployees}
                                event={props.event}
                                isAdmin={true}></EmployeeList>
                        </TabPanel>
                    </Box>
                </div>
            </>}
            {!employeeCtx.loggedInEmployee.isAdmin &&
            <>
                <div className={styles.header}>
                    <h2>{title}</h2>
                    <span>am {subtitle} {subtitle2}</span>
                    <Button className='close-button' handleClick={props.onCloseModal}>X</Button>
                </div>
                <div className={styles.body}>
                    <EmployeeList
                        assignedEmployees={props.event.extendedProps.assignedEmployees}
                        event={props.event}
                        isAdmin={false}></EmployeeList>
                </div>
            </>
            }
        </Modal>
    )
}

export default NewEventForm;