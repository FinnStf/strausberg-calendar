function CalendarDate(props){
    const WEEKDAY = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
    const weekdayString = WEEKDAY[props.date.getDay()]
    const day = props.date.getDate()
    return (
        <th>
            <div style={{fontSize: "x-small"}}>{weekdayString}</div>
            <div>{day}</div>
        </th>
    )
}
export default CalendarDate;