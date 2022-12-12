import EmployeeContext from "./employee-context";

function EmployeeContextProvider(props) {
    const employeeCtx = {
        employees: [
            {id: "1", surname: "Heike", name: "Steffan"},
            {id: "2", surname: "Reiner", name: "Steffan"},
            {id: "3", surname: "Finn", name: "Steffan"},
            {id: "4", surname: "Melanie", name: "Glück"},
            {id: "5", surname: "Anna", name: "Braun"},
            {id: "6", surname: "Sylvia", name: "Nachname"},
            {id: "7", surname: "Birgit", name: "Nachname"},
            {id: "8", surname: "Matthias", name: "Nachname"}
        ]
    }
    return (
        <EmployeeContext.Provider value={employeeCtx}>
            {props.children}
        </EmployeeContext.Provider>
    )
}

export default EmployeeContextProvider;