const LOCAL_STORAGE_NAME                = 'calendar-events';

const CALENDAR_BACK_SIDE_START_VALUE    = 2010;
const CALENDAR_BACK_SIDE_END_VALUE      = 2045;
const CALENDAR_BACK_SIDE_YEARS_CELLS    = 42;
const MONTH_COUNT                       = 12;
const LAST_MONTH_INDEX                  = 11;
const FIRST_MONTH_INDEX                 = 0;

const MONTHS                            = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL                       = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS                              = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const calendarMonthListNameList         = document.querySelector('.calendar-months--layout');
const calendarWeekDaysNameList          = document.querySelector('.calendar-week-days-names--layout');
const calendarWeekDaysBody              = document.querySelector('.calendar-month-days-list');
const monthHeading                      = document.querySelector('.calendar-month--text');
const yearHeading                       = document.querySelector('.calendar-year--text');
const actionPrevious                    = document.querySelector('.action--previous');
const actionNext                        = document.querySelector('.action--next');
const calendarBackSide                  = document.querySelector('.calendar-back-side');
const calendarContainer                 = document.querySelector('.calendar--layout');
const inputField                        = document.querySelector('.add-event-day-field');
const inputFieldButton                  = document.querySelector('.add-event-day-field-btn--action');
const currentEventDateInfo              = document.querySelector('.current-event-date');
const eventList                         = document.querySelector('.current-events-list');
const todayButton                       = document.querySelector('.calendar-today-button--action');
let calendarBackSideYears               = null; // has to be let in order to flip effect work


const init = () => {
    renderAll();
    eventTriggers();
    getClock();
    getWeatherData();
}

const renderAll = () => {
    renderDays(getCurrentMonth(), getCurrentYear());
    renderMonthNames();
    renderWeekNames();
    renderYearBackSelection(CALENDAR_BACK_SIDE_START_VALUE, CALENDAR_BACK_SIDE_END_VALUE);  
    renderEventsList(getTodayFormatted());
}

const next = () => {
    let currentYear     = getCurrentYear();
    let currentMonth    = getCurrentMonth();

    currentYear         = calcCurrentYear(currentYear, currentMonth, LAST_MONTH_INDEX, 1);
    currentMonth        = calcNextMonth(currentMonth, MONTH_COUNT);

    setCurrentMonth(currentMonth);
    setCurrentYear(currentYear);
    
    renderDays(currentMonth, currentYear);
    renderMonthNames();
}

const previous = () => {
    let currentYear     = getCurrentYear();
    let currentMonth    = getCurrentMonth();

    currentYear         = calcCurrentYear(currentYear, currentMonth, FIRST_MONTH_INDEX, -1);
    currentMonth        = calcPrevMonth(currentMonth, FIRST_MONTH_INDEX, LAST_MONTH_INDEX);

    setCurrentMonth(currentMonth);
    setCurrentYear(currentYear);

    renderDays(currentMonth, currentYear);
    renderMonthNames();
}

const jumpToMonth = (index, flagToday = false) =>  {
    if (flagToday) return getCurrentMonth();

    setCurrentMonth(index);
    renderDays(getCurrentMonth(), getCurrentYear());
    renderMonthNames();
}


// Render Methods
const renderDays = function(month, year) {

    let firstDayOfWeek      = new Date(year, month).getDay();
    let totalDaysInMonth    = daysInMonth(month, year);

    emptyInnerHTML(calendarWeekDaysBody);
    fillBlankDays(firstDayOfWeek);

    for (let day = 1; day <= totalDaysInMonth; day++) {
        let cell     = document.createElement('div');
        let cellText = document.createTextNode(day);
        // Set event data
        cell.setAttribute('data-day', day);
        cell.setAttribute('data-month', month);
        cell.setAttribute('data-year', year);
        
        if (isToday(day)) {
            cell.classList.add('active');
            inputField.setAttribute('data-event-info', getTodayFormatted());
        }
        
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

        addDayNotification(cell);

        currentEventDateInfo.textContent = inputField.getAttribute('data-event-info');
        monthHeading.textContent = MONTHS_FULL[month];
        yearHeading.textContent  = year;
    }
}


const renderMonthNames = function() {
    emptyInnerHTML(calendarMonthListNameList);

    MONTHS.forEach((month, index) => {
        let monthsTemplate         = document.createElement('div');
        monthsTemplate.textContent = `${month}`;

        if (currentMonth === index) {
            monthsTemplate.classList.add('active');
        }

        monthsTemplate.addEventListener('click', () => {
            jumpToMonth(index);
        });

        calendarMonthListNameList.appendChild(monthsTemplate);
    });
}

const renderWeekNames = function() {
    DAYS.forEach(day => {
        let daysTemplate         = document.createElement('div');
        daysTemplate.textContent = `${day}`;
        daysTemplate.classList.add('noselect');

        calendarWeekDaysNameList.appendChild(daysTemplate);
    });
}


const renderYearBackSelection = function(startYear, endYear) {
    if (endYear - startYear > CALENDAR_BACK_SIDE_YEARS_CELLS ) {
        throw new Error('Please enter valid range of years: max count 42!');
    }

    for (let year = startYear; year <= endYear; year++) {
        let yearBoxTemplate = document.createElement('div');
        let yearBoxText     = document.createTextNode(year);

        yearBoxTemplate.setAttribute('data-year', year);

        yearBoxTemplate.addEventListener('click', (e) => {
            const yearData  = e.target.getAttribute('data-year');
            currentYear     = +yearData;

            toggleCalendarSide();
            renderDays(getCurrentMonth(), getCurrentYear());
        });

        yearBoxTemplate.appendChild(yearBoxText);
        calendarBackSide.appendChild(yearBoxTemplate);
    }
}

const renderEventsList = (eventDate) => {

    const storedEvents = localStorage.getItem(LOCAL_STORAGE_NAME) 
                            ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) 
                            : [];

    if (storedEvents) {
        const currentDayEvents = storedEvents.filter(eventsToday => eventsToday.eventDate === eventDate);

        if (currentDayEvents.length > 0) {
            emptyInnerHTML(eventList);

            for (let i = 0; i < currentDayEvents.length; i++) {

                let eventListItemTemplate = document.createElement('li');
        
                eventListItemTemplate.textContent = currentDayEvents[i].eventDescription;
                eventListItemTemplate.setAttribute('data-event-id', currentDayEvents[i].id);
                eventListItemTemplate.classList.add('event-list-item');
        
                eventListItemTemplate.addEventListener('click', e => {
                    const currentEventElement   = e.target;
                    const currentEventId        = currentEventElement.getAttribute('data-event-id');
                    removeEvent(currentEventId);
                    renderEventsList(eventDate);
                });
        
                eventList.appendChild(eventListItemTemplate);
            }
            return; // In order to escape addBlankEventInfo() Otherwise it wont render the newer added events
        }

        addBlankEventInfo(eventList);
    }
}

const createEvent = () => {
    const eventDescription  = inputField.value;
    const eventDate         = inputField.getAttribute('data-event-info');
    const events            = localStorage.getItem(LOCAL_STORAGE_NAME);
    let obj                 = [];
    let id                  = 1;

    if (!eventDescription) return showAlert('wrong-input');

    if (events) obj = JSON.parse(events)

    if (obj.length > 0) id = Math.max.apply('', obj.map(entry => parseFloat(entry.id))) + 1;

    obj.push({
        'id' : id,
        'eventDate': eventDate,
        'eventDescription': eventDescription
    });

    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(obj));
    inputField.value = '';
    showAlert('event-success-creation');
    renderDays(getCurrentMonth(), getCurrentYear());
    renderEventsList(eventDate);
}

const removeEvent = (id) => {
    let storedEvents = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME));

    if (storedEvents !== null) {
        storedEvents = storedEvents.filter(event => event.id != id ); 
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(storedEvents));
        showAlert('event-deletion');
        renderDays(getCurrentMonth(), getCurrentYear());
    }
}

const getTodayLayout = () => {
    const today = new Date();

    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());

    jumpToMonth(getCurrentMonth(), true);
    renderDays(getCurrentMonth(), getCurrentYear());
    renderEventsList(getTodayFormatted());
    renderMonthNames();
}

// Events
const eventTriggers = function() {
    document.addEventListener('keydown', e => {
        if (e.code === 'ArrowLeft')     previous();
        if (e.code === 'ArrowRight')    next();
        if (e.code === 'Enter')         createEvent();
        if (e.code === 'ArrowUp')       toggleCalendarSide();
    });

    yearHeading.addEventListener('click', toggleCalendarSide);
    actionNext.addEventListener('click', next);
    actionPrevious.addEventListener('click', previous);
    inputFieldButton.addEventListener('click', createEvent);
    todayButton.addEventListener('click', getTodayLayout);
}

// Startup
init();