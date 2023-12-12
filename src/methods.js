export const getDate = () => {
    let day = new Date().getDate()
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()

    if(day < 10) day = "0" + day
    if(month < 10) month = "0" + month

    return month + "/" + day + "/" + year
}
export const getTime = () => {
    let hours = new Date().getHours()
    let minutes = new Date().getMinutes()
    let seconds = new Date().getSeconds()

    return hours + ":" + minutes + ":" + seconds
}