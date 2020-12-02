let today                       = new Date();
let todayIndex                  = today.getDate();
let currentMonth                = today.getMonth();
let currentYear                 = today.getFullYear();

const getToday = () => {
    return today;
}

const getTodayIndex = () => {
    return todayIndex;
}

const getCurrentMonth = () => {
    return currentMonth;
}

const getCurrentYear = () => {
    return currentYear
}

const getFormattedDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

const getTodayFormatted = () => {
    return `${getToday().getDate()}/${getToday().getMonth() + 1}/${getToday().getFullYear()}`;
}

const isToday = function(day) {
    return  getTodayIndex()   === day                 && 
            getCurrentMonth() === today.getMonth()    && 
            getCurrentYear()  === today.getFullYear();
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