import styles from './CalendarToolBar.module.css'
import Button from "../UI/Button";
import Input from "../UI/Input";
import {useContext} from "react";
import CalendarContext from "../../store/calendar-context";

function CalendarToolBar(props) {
    const calendarCtx = useContext(CalendarContext)
    const dateUnit = calendarCtx.dateUnit
    const curDate = calendarCtx.currentDate
    const currentDateString = curDate.toISOString().slice(0, 7)
    const dateChangeHandler = (event) => {
        calendarCtx.changeDate(event.target.value)
    }
    const onShowToday = () =>{

    }
    return (
        <div className={styles.toolbar}>
            <Button><i className="bi bi-caret-left"></i></Button>
            <Button onClick={onShowToday}>Today</Button>
            <Button><i className="bi bi-caret-right"></i></Button>
                <Input styles='date-picker' input={{
                    type: dateUnit,
                    value: `${currentDateString}`,
                    onChange: (event) => dateChangeHandler(event)
                }}/>
        </div>
    )
}

export default CalendarToolBar;