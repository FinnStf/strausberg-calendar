import EmployeeContext from "./employee-context";

function EmployeeContextProvider(props) {
    const employeeCtx = {
        shifts: [
            {id: "1", surname: "Heike", name: "Steffan", shift: [new Date("2022-10-02"), new Date("2022-10-02")]},
            {id: "2", surname: "Reiner", name: "Steffan", shift: [new Date("2022-10-02"), new Date("2022-10-02")]},
            {id: "3", surname: "Finn", name: "Steffan", shift: [new Date("2022-10-08"), new Date("2022-10-09")]}
        ]
    }
    return (
        <EmployeeContext.Provider value={employeeCtx}>
            {props.children}
        </EmployeeContext.Provider>
    )
}

export default EmployeeContextProvider;