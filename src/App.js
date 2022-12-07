import Header from "./components/Layout/Header";
import {Fragment} from "react";
import Calendar from "./components/Calendar/Calendar";
import EmployeeContextProvider from "./store/EmployeeContextProvider";
import EventContextProvider from "./store/EventContextProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {

    return (
        <Fragment>
            <Header/>
            <main>
                <EmployeeContextProvider>
                    <EventContextProvider>
                        <Calendar/>
                    </EventContextProvider>
                </EmployeeContextProvider>
            </main>
        </Fragment>
    );
}

export default App;
