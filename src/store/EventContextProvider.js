import EventContext from "./event-context";
import {useReducer} from "react";

const defaultEventObj = {
    events: [
        {
            title: 'event 1',
            start: '2022-12-12T10:30',
            end: '2022-12-12T12:30',
            extendedProps: {
                id: '1', neededEmployees: 4, assignedEmployees: [{id: "1", surname: "Heike", name: "Steffan"},
                    {id: "2", surname: "Reiner", name: "Steffan"},
                    {id: "3", surname: "Finn", name: "Steffan"},
                    {id: "4", surname: "Melanie", name: "Glück"}]
            }
        },
        {
            title: 'event 2',
            start: '2022-12-02T10:30',
            end: '2022-12-02T17:30',
            extendedProps: {id: '2', neededEmployees: 4, assignedEmployees: []}
        }],
    selectedEvent: {title: '', start: '', end: '', extendedProps: {id: '', neededEmployees: 0, assignedEmployees: []}}
}
const eventReducer = (state, action) => {
    if (action.type === "ADD_EVENT") {
        const updatedEvents = [...state.events]
        const newEvent = {...action.event, extendedProps: {...action.event.extendedProps}}
        newEvent.extendedProps.id = Math.random().toString()
        updatedEvents.push(newEvent)
        return {events: updatedEvents, selectedEvent: defaultEventObj.selectedEvent}
    } else if (action.type === 'UPDATE_EVENT') {
        const selectedEvent = action.event? action.event: state.selectedEvent;
        const updatedEvents = [...state.events]
        const eventIndex = state.events.findIndex(event => event.extendedProps.id === selectedEvent.extendedProps.id)
        updatedEvents[eventIndex] = selectedEvent
        return {events: updatedEvents, selectedEvent: state.selectedEvent}
    } else if (action.type === 'SET_SELECTED_EVENT') {
        return {...state, selectedEvent: action.event}
    } else if (action.type === 'DELETE_EVENT') {
        const updatedEvents = state.events.filter(event =>
            event.extendedProps.id !== action.eventId
        )
        return {events: updatedEvents, selectedEvent: defaultEventObj}
    } else if (action.type === 'ASSIGN_EMPLOYEE') {
        const updatedAssignedEmployees = [...state.selectedEvent.extendedProps.assignedEmployees]
        updatedAssignedEmployees.push(action.employee)
        return {...state, selectedEvent: {...state.selectedEvent, extendedProps: {...state.selectedEvent.extendedProps, assignedEmployees: updatedAssignedEmployees}}}
    }else if (action.type === 'REMOVE_ASSIGNED_EMPLOYEE'){
        let updatedAssignedEmployees = [...state.selectedEvent.extendedProps.assignedEmployees]
        updatedAssignedEmployees = updatedAssignedEmployees.filter((employee) => employee.id !== action.employeeId)
        return {...state, selectedEvent: {...state.selectedEvent, extendedProps: {...state.selectedEvent.extendedProps, assignedEmployees: updatedAssignedEmployees}}}
    }
    return defaultEventObj
}

function EventContextProvider(props) {
    const [eventCtx, dispatchEventReducer] = useReducer(eventReducer, defaultEventObj)

    // Event API
    const addEvent = (eventObj) => {
        dispatchEventReducer({type: "ADD_EVENT", event: eventObj})
    }
    const selectEvent = (eventId) => {
        const event = getEvent(eventId)
        dispatchEventReducer({type: "SET_SELECTED_EVENT", event: event})
    }
    const updateEvent = (eventObj) => {
        dispatchEventReducer({type: "UPDATE_EVENT", event: eventObj})
    }
    const deleteEvent = (eventId) => {
        dispatchEventReducer({type: "DELETE_EVENT", eventId: eventId})
    }
    const getEvent = (eventId) => {
        if (eventId === 'DEFAULT') {
            return defaultEventObj.selectedEvent
        } else {
            const eventIndex = eventCtx.events.findIndex(event => event.extendedProps.id === eventId)
            return eventCtx.events[eventIndex]
        }
    }

    // Employee API
    const assignEmployee = (employee) =>{
        dispatchEventReducer({type: "ASSIGN_EMPLOYEE", employee: employee})
        dispatchEventReducer({type: "UPDATE_EVENT"})
    }
    const removeAssignedEmployee = (emloyeeId) =>{
        dispatchEventReducer({type: "REMOVE_ASSIGNED_EMPLOYEE", employeeId: emloyeeId})
        dispatchEventReducer({type: "UPDATE_EVENT"})
    }
    // Event Ctx Object export
    const eventCtxToolBox = {
        events: eventCtx.events,
        selectedEvent: eventCtx.selectedEvent,
        selectEvent: selectEvent,
        addEvent: addEvent,
        updateEvent: updateEvent,
        deleteEvent: deleteEvent,
        assignEmployee: assignEmployee,
        removeAssignedEmployee:removeAssignedEmployee
    }
    return (
        <EventContext.Provider value={eventCtxToolBox}>
            {props.children}
        </EventContext.Provider>
    )
}

export default EventContextProvider;