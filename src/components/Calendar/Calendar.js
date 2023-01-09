import Card from "../UI/Card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import './Calendar.css'
import {useContext, useState} from "react";
import NewEventForm from "./NewEventForm";
import EventContext from "../../store/event-context";
import EmployeeContext from "../../store/employee-context";
import CalendarEvent from "./CalendarEvent";

const calendarStyleInfo = {
    height: '100%'
}

function Calendar() {
    const eventCtx = useContext(EventContext)
    const employeeCtx = useContext(EmployeeContext)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalGoingOut, setModalGoingOut] = useState(false)
    const [dateString, setDateString] = useState('')

    const handleDateClick = (date) => {
        if(employeeCtx.loggedInEmployee.isAdmin){
        eventCtx.selectEvent("DEFAULT")
        setDateString(date.dateStr)
        setModalVisible(true)
        }
    }
    const handleEventClick = (event) => {
        eventCtx.selectEvent(event.event.extendedProps.id)
        setModalVisible(true)
    }
    const handleAddEvent = (event) => {
        eventCtx.addEvent(event)
        setModalVisible(false)
    }
    const handleUpdateEvent = (event) => {
        eventCtx.updateEvent(event)
        setModalVisible(false)
    }
    const handleDeleteEvent = (eventId) => {
        eventCtx.deleteEvent(eventId)
        setModalVisible(false)
    }
    const renderEventContent = (eventInfo) => {
        return (
            <CalendarEvent
                timeText={eventInfo.timeText}
                title={eventInfo.event.title}
                employeesNeeded={eventInfo.event.extendedProps.neededEmployees}
                assignedEmployees={eventInfo.event.extendedProps.assignedEmployees}
            />
        )
    }
    const closeModal = () => {
        setModalGoingOut(true)
        setTimeout(() => {
            setModalVisible(false)
            setModalGoingOut(false)
        }, 200)
    }

    return (
        <Card className='calendar-card'>
            {modalVisible && <NewEventForm
                event={eventCtx.selectedEvent}
                dateString={dateString}
                handleAddEvent={handleAddEvent}
                handleUpdateEvent={handleUpdateEvent}
                handleDeleteEvent={handleDeleteEvent}
                onCloseModal={closeModal}
                style={`${modalGoingOut && 'out'}`}/>}
            <FullCalendar
                {...calendarStyleInfo}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={eventCtx.events}
                dateClick={handleDateClick}
                eventContent={renderEventContent}
                eventClick={handleEventClick}
            />
        </Card>)
}

export default Calendar;