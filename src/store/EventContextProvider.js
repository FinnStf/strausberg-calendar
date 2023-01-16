import EventContext from "./event-context";
import {useCallback, useContext, useEffect, useReducer} from "react";
import {addDoc, collection, getDocs} from "firebase/firestore";
import {firestore} from "../firebase";
import {deleteDoc, doc, updateDoc} from "firebase/firestore";
import {getDefaultTimeString} from "../logic/calendar-transformer";
import EmployeeContext from "./employee-context";


const defaultEventObj = {
    events: [],
    selectedEvent: {title: '', start: '', end: '', extendedProps: {id: '', neededEmployees: 0, assignedEmployees: []}}
}
const eventReducer = (state, action) => {
    if (action.type === 'SET') {
        return {...state, events: action.events}
    }
    if (action.type === "ADD_EVENT") {
        const updatedEvents = [...state.events]
        const newEvent = {...action.event, extendedProps: {...action.event.extendedProps}}
        updatedEvents.push(newEvent)
        return {events: updatedEvents, selectedEvent: defaultEventObj.selectedEvent}
    } else if (action.type === 'UPDATE_EVENT') {
        const selectedEvent = action.event ? action.event : state.selectedEvent;
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
        return {...state,
            selectedEvent: {
                ...state.selectedEvent,
                extendedProps: {...state.selectedEvent.extendedProps, assignedEmployees: updatedAssignedEmployees}
            }
        }
    } else if (action.type === 'REMOVE_ASSIGNED_EMPLOYEE') {
        let updatedAssignedEmployees = [...state.selectedEvent.extendedProps.assignedEmployees]
        updatedAssignedEmployees = updatedAssignedEmployees.filter((employee) => employee.id !== action.employeeId)
        return {...state,
            selectedEvent: {
                ...state.selectedEvent,
                extendedProps: {...state.selectedEvent.extendedProps, assignedEmployees: updatedAssignedEmployees}
            }
        }
    }
    return defaultEventObj
}

function EventContextProvider(props) {
    const employeeCtx = useContext(EmployeeContext)
    const eventCollectionRef = collection(firestore, "event")
    const [eventCtx, dispatchEventReducer] = useReducer(eventReducer, defaultEventObj)

    const fetchEvents = useCallback(async () => {
        const data = await getDocs(eventCollectionRef);
        const eventData = data.docs.map((doc) => ({data: doc.data(), id: doc.id}));
        const events = eventData.map((event) => {
            const eventObj = {...event.data}
            eventObj.extendedProps.id = event.id
            return eventObj
        })
        if (eventData.length > 0) {
            dispatchEventReducer({type: 'SET', events: events})
        }
    }, [eventCollectionRef]);

    useEffect(() => {
        fetchEvents()
    }, []);

    // Event API
    const addEvent = async (eventObj) => {
        //set default start and end time if values are equal
        if (eventObj.start===eventObj.end&&eventObj.start!==""){
            eventObj.start = getDefaultTimeString(eventObj.start, "12:00")
            eventObj.end = getDefaultTimeString(eventObj.end, "17:00")
        }
        const docRef = await addDoc(eventCollectionRef, eventObj);
        const newEvent = {...eventObj}
        newEvent.extendedProps.id = docRef.id
        dispatchEventReducer({type: "ADD_EVENT", event: newEvent})
        return docRef.id
    }
    const selectEvent = (eventId) => {
        const event = getEvent(eventId)
        dispatchEventReducer({type: "SET_SELECTED_EVENT", event: event})
    }
    const updateEvent = async (eventObj) => {
        const eventDoc = doc(firestore, "event", eventObj.extendedProps.id);
        await updateDoc(eventDoc, eventObj);
        dispatchEventReducer({type: "UPDATE_EVENT", event: eventObj})
    }
    const deleteEvent = async (eventId) => {
        const eventDoc = doc(firestore, "event", eventId);
        await deleteDoc(eventDoc);
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
    const assignEmployee = async (employee) => {
        const eventId = eventCtx.selectedEvent.extendedProps.id
        //in case event hasn't been added jet
        if (eventId===""){
            const id = await addEvent(eventCtx.selectedEvent)
            selectEvent(id)
        }
        //update assignedEmployees in event database and context
        const assignedEmployees = [...eventCtx.selectedEvent.extendedProps.assignedEmployees]
        assignedEmployees.push(employee)
        const eventDoc = doc(firestore, "event", eventId);
        await updateDoc(eventDoc, {"extendedProps.assignedEmployees": assignedEmployees});
        dispatchEventReducer({type: "ASSIGN_EMPLOYEE", employee: employee})
        dispatchEventReducer({type: "UPDATE_EVENT"})
    }
    const removeAssignedEmployee = async (employeeObj, eventParamId) => {
        //workaround next time don't work with a selected context object but pass all data through params
        if (eventParamId){
            selectEvent(eventParamId)
        }
        const eventId = eventCtx.selectedEvent.extendedProps.id
        let updatedAssignedEmployees = [...eventCtx.selectedEvent.extendedProps.assignedEmployees]
        updatedAssignedEmployees = updatedAssignedEmployees.filter((employee) => employee.id !== employeeObj.id)
        const eventDoc = doc(firestore, "event", eventId);
        await updateDoc(eventDoc, {"extendedProps.assignedEmployees": updatedAssignedEmployees});
        dispatchEventReducer({type: "REMOVE_ASSIGNED_EMPLOYEE", employeeId: employeeObj.id})
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
        removeAssignedEmployee: removeAssignedEmployee
    }
    return (
        <EventContext.Provider value={eventCtxToolBox}>
            {props.children}
        </EventContext.Provider>
    )
}

export default EventContextProvider;