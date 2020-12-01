const LOCAL_STORAGE_NAME = 'calendar-events';

const MONTHS         = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL    = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS           = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const daysAfterTheMonthStarted = 32;

const calendarMonthListNameList = document.querySelector('.calendar-months--layout');
const calendarWeekDaysNameList  = document.querySelector('.calendar-week-days-names--layout');
const calendarWeekDaysBody      = document.querySelector('.calendar-month-days-list');
const monthHeading              = document.querySelector('.calendar-month--text');
const yearHeading               = document.querySelector('.calendar-year--text');
const actionPrevious            = document.querySelector('.action--previous');
const actionNext                = document.querySelector('.action--next');
const calendarBackSide          = document.querySelector('.calendar-back-side');
const calendarContainer         = document.querySelector('.calendar--layout');
const inputField                = document.querySelector('.add-event-day-field');
const inputFieldButton          = document.querySelector('.add-event-day-field-btn--action');
const currentEventDateInfo      = document.querySelector('.current-event-date');

let eventList                   = document.querySelector('.current-events-list');
let calendarBackSideYears       = null;

let today           = new Date();
let todayIndex      = today.getDate();
let currentMonth    = today.getMonth();
let currentYear     = today.getFullYear();

// Notes:
// Add Today jump to today

const init = function() {
    renderAll();
    eventTriggers();
}

const renderAll = function() {
    renderDays(currentMonth, currentYear);
    renderMonthNames();
    renderWeekNames();
    renderYearBackSelection(2010, 2045);
    renderEventsList(getTodayFormatted());
}

const next = function() {
	currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
	currentMonth = (currentMonth + 1) % 12;
    renderDays(currentMonth, currentYear);
    renderMonthNames();
}

const previous = function() {
	currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
	currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    renderDays(currentMonth, currentYear);
    renderMonthNames();
}

const jumpToMonth = function(index) {
    currentMonth = index;
    renderDays(currentMonth, currentYear);
    renderMonthNames();
}


const isToday = function(day) {
    return  todayIndex   === day                 && 
            currentMonth === today.getMonth()    && 
            currentYear  === today.getFullYear();
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

const getFormattedDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

const getTodayFormatted = () => {
    return `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
}


const addBlankEventInfo = (eventList) => {
    let eventListItemTemplate = document.createElement('li');

    eventList.textContent = 'No events found 🤔';
    eventList.classList.add('event-list-item-not-found');
    eventList.appendChild(eventListItemTemplate);
} 


const renderEventsList = (eventDate) => {
    let storedEvents = localStorage.getItem(LOCAL_STORAGE_NAME)
        ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME))
        : [];

    if (storedEvents) {
        let currentDayEvents = storedEvents.filter(eventsToday => eventsToday.eventDate === eventDate);

        if (currentDayEvents.length > 0) {

            eventList.innerHTML = '';
            
            for (let i = 0; i < currentDayEvents.length; i++) {

                let eventListItemTemplate = document.createElement('li');
        
                eventListItemTemplate.textContent = currentDayEvents[i].eventDescription;
                eventListItemTemplate.setAttribute('data-event-id', currentDayEvents[i].id);
                eventListItemTemplate.classList.add('event-list-item');
        
                eventListItemTemplate.addEventListener('click', e => {
                    const currentEventElement = e.target;
                    const currentEventId = currentEventElement.getAttribute('data-event-id');
                    removeEvent(currentEventId);
                    renderEventsList(eventDate);
                });
        
                eventList.appendChild(eventListItemTemplate);
            }
            return; // !important
        }

        addBlankEventInfo(eventList);
    }
}



const removeEvent = (id) => {
    let storedEvents = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME));

    if (storedEvents !== null) {
        storedEvents = storedEvents.filter(event => event.id != id ); 
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(storedEvents));
    }
}     

const createEvent = () => {
    let eventDescription = inputField.value;
    eventDate = inputField.getAttribute('data-event-info');

    if (!eventDescription) return alert('Invalid input');

    let events = localStorage.getItem(LOCAL_STORAGE_NAME);
    let obj = [];

    if (events) {
        obj = JSON.parse(events);
    }

    let id = 1;
    if (obj.length > 0) {
        //! APPLY FUNCTION DOES THE MAGIC
        id = Math.max.apply('', obj.map(entry => parseFloat(entry.id))) + 1;
    }

    obj.push({
        'id' : id,
        'eventDate': eventDate,
        'eventDescription': eventDescription
    });

    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(obj));
    inputField.value = '';
    renderEventsList(eventDate);
}



const renderDays = function(month, year) {

    let firstDayOfWeek = new Date(year, month).getDay();
    let totalDaysInMonth = daysInMonth(month, year);

    calendarWeekDaysBody.innerHTML = '';
    fillBlankDays(firstDayOfWeek);

    for (let day = 1; day <= totalDaysInMonth; day++) {
        let cell = document.createElement('div');
        let cellText = document.createTextNode(day);

        if (isToday(day)) {
            cell.classList.add('active');
            // Set initial date to the add event action button
            currentEventDateInfo.textContent = getTodayFormatted();
            inputField.setAttribute('data-event-info', getTodayFormatted());
        }
        // Event data
        cell.setAttribute('data-day', day);
        cell.setAttribute('data-month', month);
        cell.setAttribute('data-year', year);

        cell.appendChild(cellText);
        calendarWeekDaysBody.appendChild(cell);

        cell.addEventListener('click', e => {
            const date = new Date(
                +e.target.getAttribute('data-year'),
                +e.target.getAttribute('data-month'),
                +e.target.getAttribute('data-day')
            );

            currentEventDateInfo.textContent = getFormattedDate(date);
            inputField.setAttribute('data-event-info', getFormattedDate(date));
            renderEventsList(getFormattedDate(date));
        });

        monthHeading.textContent = MONTHS_FULL[month];
        yearHeading.textContent = year;
    }
}


const renderMonthNames = function() {
    calendarMonthListNameList.innerHTML = '';

    MONTHS.forEach((month, index) => {

        let monthsTemplate = document.createElement('div');
        monthsTemplate.textContent = `${month}`;

        if (currentMonth === index) {
            monthsTemplate.classList.add('active');
        }

        monthsTemplate.setAttribute('data-month', `${index}`);

        monthsTemplate.addEventListener('click', () => {
            jumpToMonth(index);
        });

        calendarMonthListNameList.appendChild(monthsTemplate);
    });
}

const renderWeekNames = function() {
    DAYS.forEach(day => {
        let daysTemplate = document.createElement('div');
        daysTemplate.textContent = `${day}`;
        daysTemplate.classList.add('noselect');

        calendarWeekDaysNameList.appendChild(daysTemplate);
    });
}

// 42 years is suitable for layout
const renderYearBackSelection = function(startYear, endYear) {
    if (endYear - startYear > 42) {
        return alert('Please enter other value!');
    }

    calendarBackSide.innerHTML = '';

    for (let year = startYear; year <= endYear; year++) {
        let yearBoxTemplate = document.createElement('div');
        let yearBoxText     = document.createTextNode(year);

        yearBoxTemplate.setAttribute('data-year', year);

        yearBoxTemplate.appendChild(yearBoxText);
        calendarBackSide.appendChild(yearBoxTemplate);
    }
}


const eventTriggers = function() {

    actionNext.addEventListener('click', next);
    actionPrevious.addEventListener('click', previous);

    yearHeading.addEventListener('click', () => {
        calendarContainer.classList.toggle("flip");
    });

    inputFieldButton.addEventListener('click', createEvent);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowUp') {
            calendarContainer.classList.toggle('flip');
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        calendarBackSideYears = document.querySelectorAll('.calendar-back-side div');
    
        calendarBackSideYears.forEach(year => {
            year.addEventListener('click', (e) => {
                const yearData = e.target.getAttribute('data-year');
                currentYear = +yearData;
    
                calendarContainer.classList.toggle('flip');
                renderDays(currentMonth, currentYear);
            });
        });

        document.addEventListener('keydown', e => {
            if (e.code === 'ArrowLeft') previous();
            if (e.code === 'ArrowRight') next();
            if (e.code === 'Enter') createEvent();
        });
    });
}


// Startup
init();