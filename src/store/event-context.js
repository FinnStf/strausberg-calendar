import React from "react";

const EventContext = React.createContext({
    events: [],
    selectedEvent: {},
    selectEvent: (eventId)=>{},
    addEvent:(eventObj)=>{},
    updateEvent: (eventObj)=>{},
    deleteEvent:(eventId)=>{},
    assignEmployee:(employee)=>{},
    removeAssignedEmployee:(employee)=>{}
})
export default EventContext