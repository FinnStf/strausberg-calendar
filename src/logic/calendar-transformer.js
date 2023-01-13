/*
function parsing Date String into date and time string
 */
export const splitDateTime = (dateString) =>{
    if (dateString){
        const [date,time] = dateString.split('T')
        return {date: date, time: time}
    }else{
        return {date: '', time: ''}
    }

}
/*
function parsing date and time string into DateString
 */
export const concatDateTime = (date, time) => {
    const dateTimeString = `${date}T${time}`
    return dateTimeString
}

/*
function getting default Time String for Events
 */
export const getDefaultTimeString = (dateStr, hourSring) => {
    const {date, time} = splitDateTime(dateStr)
    return `${date}T${hourSring}`
}

/*
calculate time between timestrings
 */
export const getTimeSpanInMinutes = (startStr, endStr) => {
    var startDate = new Date(startStr);
    var endDate   = new Date(endStr);
    var minutes = (endDate.getTime() - startDate.getTime()) / 60000;
    return minutes
}

export const getLocalDateString = (dateStr) => {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).substr(-2)
    const day = ('0' + date.getDate()).substr(-2)
    const newDateStr = [day, month, year].join('.')
    return newDateStr
}