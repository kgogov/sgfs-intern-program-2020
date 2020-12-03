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

const getDayInfo = (cell) => {
    return `${cell.attr('data-day')}/${+cell.attr('data-month') + 1}/${cell.attr('data-year')}`;
}

const getDaysCollection = () => {
    const storage   =  JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || [];
    return storage.map(event => event.eventDate);
}


const isToday = function(day) {
    return  getTodayIndex()   === day                 && 
            getCurrentMonth() === today.getMonth()    && 
            getCurrentYear()  === today.getFullYear();
}

const createText = function (value) {
    return document.createTextNode(value);
}

// day 0 here returns the last day of the PREVIOUS month
const daysInMonth = function(month, year) {
	return new Date(year, month + 1, 0).getDate();
}

const fillBlankDays = function(count) {
    for (let space = 0; space < count; space++) {

        let cell = KQ('<div>');
        cell.addClass('empty-cell');

        calendarWeekDaysBody.valueOf().append(cell.valueOf());
    }
}

const addDayNotification = (cell) => {
    getDaysCollection().forEach(event => {
        if (event === getDayInfo(cell)) {
            cell.addClass('event-day');
        };
    });
}

const addBlankEventInfo = (eventList) => {
    eventList.text('No events found 🤔'); 
} 

const toggleCalendarSide = function() {
    calendarContainer.toggleClass('flip');
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