import Card from "../UI/Card";
import CalendarToolBar from "./CalendarToolBar";
import CalendarBody from './CalendarBody'
import CalendarContextProvider from "../../store/CalendarContextProvider";
import EmployeeContextProvider from "../../store/EmployeeContextProvider";

function Calendar() {

    return (
        <Card>
            <CalendarContextProvider>
                <EmployeeContextProvider>
                    <CalendarToolBar/>
                    <CalendarBody/>
                </EmployeeContextProvider>
            </CalendarContextProvider>
        </Card>)
}

export default Calendar;