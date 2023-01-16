import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {
    concatDateTime,
    getLocalDateString,
    getTimeSpanInMinutes,
    splitDateTime
} from "../../logic/calendar-transformer";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import {useContext, useEffect, useState} from "react";
import ShiftForm from "./ShiftForm";
import EventContext from "../../store/event-context";

function isDateInTheFuture(value) {
    const selectedDate = new Date(value)
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return selectedDate > now
}

const columns = [
    {
        id: 'startDate',
        label: 'Datum',
        align: 'left',
        format: (value) => getLocalDateString(value),
        style: (value) => isDateInTheFuture(value)
    },
    {
        id: 'startTime',
        label: 'Start',
        align: 'left',
    },
    {
        id: 'endTime',
        label: 'Ende',
        align: 'left',
    },
    {
        id: 'pause',
        label: 'Pause (min)',
        align: 'left'
    },
    {
        id: 'time',
        label: 'Arbeitszeit (min)',
        align: 'left'
    }
];

function createData(id, start, end, pause) {
    const {date: startDate, time: startTime} = splitDateTime(start)
    const {time: endTime} = splitDateTime(end)
    const time = getTimeSpanInMinutes(start, end) - pause
    return {id, startDate, startTime, endTime, pause, time};
}

export default function ShiftTable(props) {
    const eventCtx = useContext(EventContext)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = useState([])
    const [shiftData, setShiftData] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [modalGoingOut, setModalGoingOut] = useState(false)
    const handleOpen = () => setModalVisible(true);
    const handleClose = () => {
        setModalGoingOut(true)
        setTimeout(() => {
            setModalVisible(false)
            setModalGoingOut(false)
        }, 200)
    }
    useEffect(() => {
        if (props.employee&& props.employee.shifts) {
            setRows(props.employee.shifts.map(shift => createData(shift.id, shift.start, shift.end, shift.pause)))
        }
    }, [props.employee, props.employee.shifts])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleEditShift = (rowIndex) => {
        const shiftData = rows[rowIndex]
        setShiftData(shiftData)
        handleOpen()
    };
    const handleUpdateShift = (start, end, pause) => {
        const startDate = concatDateTime(shiftData.startDate, start)
        const endDate = concatDateTime(shiftData.startDate, end)
        props.employeeCtx.updateShift(props.employee, shiftData.id, startDate, endDate, pause)
        handleClose()
    };
    const handleDeleteShift = () => {
        props.employeeCtx.removeShift(props.employee, shiftData.id)
        eventCtx.removeAssignedEmployee(props.employee, shiftData.id)
        handleClose()
    }
    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            {modalVisible &&
            <ShiftForm shift={shiftData}
                       handleUpdateEvent={handleUpdateShift}
                       handleDeleteEvent={handleDeleteShift}
                       onCloseModal={handleClose}
                       style={`${modalGoingOut && 'out'}`}/>
            }
            <TableContainer sx={{maxHeight: 440}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell>
                                Aktionen
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={`table_entry_${index}`}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            let tableEntry;
                                            if (column.label) {
                                                tableEntry = <TableCell style={column.style && column.style(value) ? {
                                                    fontWeight: 'bold',
                                                    color: '#5c6c5d'
                                                } : {}} key={column.id} align={column.align}>
                                                    {column.format ? column.format(value) : column.label && value}
                                                </TableCell>
                                            }
                                            return (
                                                tableEntry
                                            );
                                        })}
                                        <TableCell>
                                            <IconButton onClick={() => {
                                                handleEditShift(index)
                                            }} aria-label="delete">
                                                <EditIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
