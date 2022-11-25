export const fillTableDates = (startDate, numberOfDates) => {
    let dates = []
    const month = startDate.getMonth()
    const year = startDate.getFullYear()
    for (let i=0; i<numberOfDates; i++){
        dates.push(new Date(year,month,startDate.getDate()+i))
    }
    return dates;
}
export const getFistDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}
export const getNumberOfDaysOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
};