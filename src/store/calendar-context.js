import React from "react";

const CalendarContext = React.createContext({
    tableDates:[],
    dateUnit:'',
    currentDate:new Date(Date.now()),
    changeDateUnit:()=>{},
    changeDate:()=>{}
})
export default CalendarContext