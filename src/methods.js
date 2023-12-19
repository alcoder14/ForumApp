
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

// SORT ARRAYS

export const sortItems = (items, sortBy) => {
    let sortedItems;
    if(sortBy === "newest"){
        sortedItems = sortItemsDesc(items)
    } else {
        sortedItems = sortItemsAsc(items)
    }
    return sortedItems;
}

const sortItemsAsc = (objectsArray) => {

    const compareDateTime = (a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA - dateB;
    };
  
    return objectsArray.sort(compareDateTime);
  };

const sortItemsDesc = (objectsArray) => {

    const compareDateTimeDescending = (a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB - dateA;
    };
  
    return objectsArray.sort(compareDateTimeDescending);
  };