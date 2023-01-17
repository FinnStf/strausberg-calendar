import DownloadIcon from '@mui/icons-material/Download';
import {IconButton} from "@mui/material";
import {useContext} from "react";
import EmployeeContext from "../../store/employee-context";

// The data array
const theData = [
    ["Vorname", "Nachname", "Datum", "Start", "Ende", "Pause"]
]

export default function ShiftDownload(props) {
    const employees = useContext(EmployeeContext).employees
    const date = new Date(props.monthFilter)
    const month = date.getMonth()
    const year = date.getFullYear()

    const handleDownload = () => {
        const csvFile = generateDownloadFile()
        startBlobDownload('text/csv', csvFile, `ArbeitszeitenStrausberghuette_${year}/${month + 1}.csv`);
    }
    const generateDownloadFile = () => {
        employees.map(employee => {
            if (employee.shifts.length > 0) {
                const dataRowTemplate = [employee.surname, employee.lastname]
                employee.shifts
                    .filter(shift => new Date(shift.start).getMonth() === month)
                    .map(shift => {
                        const dataRowStart = [...dataRowTemplate]
                        const startDate = new Date(shift.start)
                        const endDate = new Date(shift.end)
                        const dataRowEnd = [startDate.toLocaleDateString(), startDate.toLocaleTimeString(), endDate.toLocaleTimeString(), shift.pause.toString()]
                        theData.push([...dataRowStart, ...dataRowEnd])
                    })
            }
        })
        let csvFormat = theData.map(row => row.join(",")).join("\n");
        return csvFormat
    }

    function startBlobDownload(MIME, file, filename) {
        const data = file;
        const myBlob = new Blob([data], {type: MIME})
        const blobURL = URL.createObjectURL(myBlob);

        const a = document.createElement('a');
        a.setAttribute('href', blobURL);
        a.setAttribute('download', filename);

        a.style.display = 'none';
        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(blobURL);
    }

    return (
        <IconButton onClick={handleDownload}>
            <DownloadIcon/>
        </IconButton>)
}