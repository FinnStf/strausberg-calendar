import CalendarContext from "./calendar-context";
import {useReducer} from "react";
import {
    fillTableDates,
    getFistDayOfMonth,
    getNumberOfDaysOfMonth
} from "../logic/calendar-logic";

const defaultCalendarState = {
    tableDates: fillTableDates(getFistDayOfMonth(new Date(Date.now())), getNumberOfDaysOfMonth(new Date(Date.now()))),
    dateUnit: 'month',
    currentDate: new Date(Date.now()),
}
const calendarReducer = (state, action) => {
    let updatedTables, updatedDateUnit, updatedCurrentDate;
    if (action.type === "SET_DATE") {
        updatedCurrentDate = action.date
        updatedTables = fillTableDates(getFistDayOfMonth(action.date), getNumberOfDaysOfMonth(action.date))
        return {tableDates: updatedTables, dateUnit: state.dateUnit, currentDate: updatedCurrentDate}
    } else if (action.type === "CHANGE_UNIT") {
        updatedDateUnit = action.unit
        //decide what to do here
        return {...defaultCalendarState, dateUnit: updatedDateUnit}
    }
    return defaultCalendarState;
}

function CalendarContextProvider(props) {
    const [calendar, dispatchCalendar] = useReducer(calendarReducer, defaultCalendarState)

    const changeDate = (date) => {
        dispatchCalendar({type: "SET_DATE", date: new Date(date)})
    }
    const changeDateUnit = (dateUnit) => {
        dispatchCalendar({type: "CHANGE_UNIT", unit: dateUnit})
    }
    const calendarContext = {
        tableDates: calendar.tableDates,
        dateUnit: calendar.dateUnit,
        changeDateUnit: changeDateUnit,
        currentDate: calendar.currentDate,
        changeDate: changeDate
    }
    return (
        <CalendarContext.Provider value={calendarContext}>
            {props.children}
        </CalendarContext.Provider>
    )
}

export default CalendarContextProvider;