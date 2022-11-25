import Header from "./components/Layout/Header";
import {Fragment} from "react";
import Calendar from "./components/Calendar/Calendar";

function App() {

    return (
        <Fragment>
            <Header/>
            <main>
                <Calendar/>
            </main>
        </Fragment>
    );
}

export default App;
