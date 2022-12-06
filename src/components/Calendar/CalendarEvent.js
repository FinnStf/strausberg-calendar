import styles from './CalenderEvent.module.css'
import {useEffect, useState} from "react";
import {Dropdown} from "react-bootstrap";
import Button from "../UI/Button";

function CalendarEvent(props) {
    const [eventStyle, setEventStyle] = useState('')
    useEffect(() => {
        setEventStyle(calcEventStyle(props.employeesNeeded))
    }, [props.employeesNeeded])

    const calcEventStyle = (numbEmployees) => {
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
            <Dropdown className={styles['event-dropdown']} drop="end">
                <Dropdown.Toggle>
                <span className={styles['event-title']}>
                    <span>{props.timeText}</span>
                    <b>{props.title}</b>
                </span>
                    <div>
                        <i>{props.employeesNeeded} offene Stellen</i>
                    </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles['event-dropdown-menu']}>
                    <Button>Mitarbeiter zuordnen</Button>
                    <Button>Event {props.title} bearbeiten</Button>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default CalendarEvent