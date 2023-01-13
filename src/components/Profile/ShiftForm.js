import Modal from "../UI/Modal";
import styles from "../Calendar/NewEventForm.module.css";
import Button from "../UI/Button";
import Input from "../UI/Input";
import {useState} from "react";

export default function ShiftForm(props) {
    const [startTime, setStartTime] = useState(props.shift.startTime)
    const [endTime, setEndTime] = useState(props.shift.endTime)
    const [pause, setPause] = useState(props.shift.pause)

    const onSubmitForm = (event) => {
        event.preventDefault()
        props.handleUpdateEvent(startTime, endTime, pause)
    }
    const onDeleteShift = () => {
    props.handleDeleteEvent()
    }

    return (
        <Modal style={props.style} handleClick={props.onCloseModal}>
            <div className={styles.header}>
                <h2>Schicht am {props.shift.startDate} bearbeiten</h2>
                <Button className='close-button' handleClick={props.onCloseModal}>X</Button>
            </div>
            <div className={styles.body}>
                <form onSubmit={onSubmitForm}>
                    <div className={styles["form-body"]}>
                        <Input label="Gearbeitet von" input={{type: "time",value:startTime, onChange:(e)=>{setStartTime(e.target.value)}}}/>
                        <Input label="Gearbeitet bis" input={{type: "time",value:endTime, onChange:(e)=>{setEndTime(e.target.value)}}}/>
                        <Input label="Pause in Minuten" input={{type: "number",value:pause, onChange:(e)=>{setPause(e.target.value)}}}/>
                    </div>
                    <div className={styles.footer}>
                        <Button handleClick={onDeleteShift}
                                className="negative">Löschen</Button>
                        <Button type="submit" className="positive">Ändern</Button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}
