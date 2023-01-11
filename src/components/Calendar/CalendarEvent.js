import styles from './CalenderEvent.module.css'
import {useEffect, useState} from "react";

function CalendarEvent(props) {
    const [eventStyle, setEventStyle] = useState('')
    const [eventMarker, setEventMarker] = useState(false)
    const [openSlotCount, setOpenSlotCount] = useState(0)

    useEffect(() => {
        setEventStyle(calcEventBackgroundColor(props.employeesNeeded - props.assignedEmployees.length))
        setOpenSlotCount(props.employeesNeeded - props.assignedEmployees.length)
        setEventMarker(props.assignedEmployees.filter(employee=>employee.id===props.loggedInEmployee.id).length>0)
    }, [props.employeesNeeded, props.assignedEmployees])

    const calcEventBackgroundColor = (numbEmployees) => {
        if (numbEmployees > 3) {
            return 'high-demand'
        } else if (numbEmployees >= 1) {
            return 'medium-demand'
        } else {
            return 'no-demand'
        }
    }

    return (
        <div className={`${styles['event-item']} ${styles[eventStyle]}`}>
            <div className={`${eventMarker?styles['marked-event']:''}`}></div>
            <span className={styles['event-title']}>
                <span>{props.timeText}</span>
                <b>{props.title}</b>
            </span>
            <div>
                {openSlotCount >= 0 ? <i>{openSlotCount} offene Stellen</i> :
                    <i>{Math.abs(openSlotCount)} MA zu viel</i>}
            </div>
        </div>
    )
}

export default CalendarEvent