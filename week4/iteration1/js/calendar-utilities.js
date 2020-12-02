let today                       = new Date();
let todayIndex                  = today.getDate();
let currentMonth                = today.getMonth();
let currentYear                 = today.getFullYear();

const getCurrentMonth = function() {
    return currentMonth;
}

const setCurrentMonth = (month) => {
    currentMonth = month;
}

const getCurrentYear = function() {
    return currentYear;
}

const setCurrentYear = function(year) {
    currentYear = year;
}

const getToday = function() {
    return today;
}

const getTodayIndex = function() {
    return todayIndex;
}

const getFormattedDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

const getTodayFormatted = () => {
    return `${getToday().getDate()}/${getToday().getMonth() + 1}/${getToday().getFullYear()}`;
}

const getDaysCollection = () => {
    const storage   =  JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || [];
    return storage.map(event => event.eventDate);
}


const getDayInfo = (cell) => {
    return `${cell.getAttribute('data-day')}/${+cell.getAttribute('data-month') + 1}/${cell.getAttribute('data-year')}`;
}

const isToday = function(day) {
    return  getTodayIndex()   === day                 && 
            getCurrentMonth() === today.getMonth()    && 
            getCurrentYear()  === today.getFullYear();
}

const emptyInnerHTML = (el) => {
    el.innerHTML = '';
}

// day 0 here returns the last day of the PREVIOUS month
const daysInMonth = function(month, year) {
	return new Date(year, month + 1, 0).getDate();
}

const fillBlankDays = function(count) {
    for (let space = 0; space < count; space++) {
        let cell = document.createElement('div');
        let cellText = document.createTextNode('');

        cell.classList.add('empty-cell');
        cell.appendChild(cellText);
        calendarWeekDaysBody.appendChild(cell);
    }
}

const addBlankEventInfo = (eventList) => {
    let eventListItemTemplate = document.createElement('li');

    eventList.textContent = 'No events found 🤔';
    eventList.classList.add('event-list-item-not-found');
    eventList.appendChild(eventListItemTemplate);
} 

const toggleCalendarSide = function() {
    calendarContainer.classList.toggle('flip');
}


const calcCurrentYear = (year, month, index, prevOrNext) => {
    if (prevOrNext === 1) {
        return year = month === index ? year + 1 : year;
    }
    return year = month === index ? year - 1 : year;;
}

const calcNextMonth = (month, count) => {
    return (month + 1) % count;
}

const calcPrevMonth = (month, firstIndex, lastIndex) => {
    return month = month === firstIndex ? lastIndex : month - 1;
}