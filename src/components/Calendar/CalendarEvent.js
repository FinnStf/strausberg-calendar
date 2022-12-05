import styles from './CalenderEvent.module.css'
import {useEffect, useState} from "react";

function CalendarEvent(props) {
    const [eventStyle, setEventStyle] = useState('')
    useEffect(()=>{
       setEventStyle(calcEventStyle(props.employeesNeeded))
    },[props.employeesNeeded])

    const calcEventStyle = (numbEmployees) =>{
        if (numbEmployees>3){
            return 'high-demand'
        }else if (numbEmployees>=1){
            return 'medium-demand'
        }else{
            return 'no-demand'
        }
    }

    return (
        <div className={`${styles['event-item']} ${styles[eventStyle]}`}>
            <span className={styles['event-title']}>
                <span>{props.timeText}</span>
                <b>{props.title}</b>
            </span>
            <div>
                <i>{props.employeesNeeded} offene Stellen</i>
            </div>
        </div>
    )
}

export default CalendarEvent