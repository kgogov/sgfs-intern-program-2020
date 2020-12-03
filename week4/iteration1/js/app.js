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

const calendarMonthListNameList         = KQ('.calendar-months--layout');
const calendarWeekDaysNameList          = KQ('.calendar-week-days-names--layout');
const calendarWeekDaysBody              = KQ('.calendar-month-days-list');
const monthHeading                      = KQ('.calendar-month--text');
const yearHeading                       = KQ('.calendar-year--text');
const actionPrevious                    = KQ('.action--previous');
const actionNext                        = KQ('.action--next');
const calendarBackSide                  = KQ('.calendar-back-side');
const calendarContainer                 = KQ('.calendar--layout');
const inputField                        = KQ('.add-event-day-field');
const inputFieldButton                  = KQ('.add-event-day-field-btn--action');
const currentEventDateInfo              = KQ('.current-event-date');
const eventList                         = KQ('.current-events-list');
const todayButton                       = KQ('.calendar-today-button--action');
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

    calendarWeekDaysBody.empty();
    fillBlankDays(firstDayOfWeek);

    for (let day = 1; day <= totalDaysInMonth; day++) {
        let cell = KQ('<div>');
        let cellText = createText(day);
        // Set event data
        cell.attr('data-day', day);
        cell.attr('data-month', month);
        cell.attr('data-year', year);
        
        if (isToday(day)) {
            cell.addClass('active');
            inputField.attr('data-event-info', getTodayFormatted());
        }
        
        cell.valueOf().append(cellText);
        calendarWeekDaysBody.valueOf().append(cell.valueOf());

        cell.on('click', e => {
            const date = new Date(
                +e.target.getAttribute('data-year'),
                +e.target.getAttribute('data-month'),
                +e.target.getAttribute('data-day')
            );
            currentEventDateInfo.text(getFormattedDate(date));

            inputField.attr('data-event-info', getFormattedDate(date));
            renderEventsList(getFormattedDate(date));
        });

        addDayNotification(cell);

        currentEventDateInfo.text(inputField.attr('data-event-info'));
        monthHeading.text(MONTHS_FULL[month]);
        yearHeading.text(year);
    }
}


const renderMonthNames = function() {
    calendarMonthListNameList.empty();

    MONTHS.forEach((month, index) => {
        let monthsTemplate = KQ('<div>');
        monthsTemplate.text(`${month}`); 

        if (getCurrentMonth() === index) {
            monthsTemplate.addClass('active');
        }

        monthsTemplate.on('click', () => { jumpToMonth(index); });
        calendarMonthListNameList.valueOf().append(monthsTemplate.valueOf());
    });
}

const renderWeekNames = function() {
    DAYS.forEach(day => {
        let daysTemplate = KQ('<div>');
        daysTemplate.text(`${day}`); 
        daysTemplate.addClass('noselect');

        calendarWeekDaysNameList.valueOf().append(daysTemplate.valueOf());
    });
}


const renderYearBackSelection = function(startYear, endYear) {
    if (endYear - startYear > CALENDAR_BACK_SIDE_YEARS_CELLS ) {
        throw new Error('Please enter valid range of years: max count 42!');
    }

    for (let year = startYear; year <= endYear; year++) {
        let yearBoxTemplate = KQ('<div>');
        let yearBoxText     = createText(year);

        yearBoxTemplate.attr('data-year', year);

        yearBoxTemplate.on('click', (e) => {
            const yearData = e.target.getAttribute('data-year');
            currentYear    = +yearData;

            toggleCalendarSide();
            renderDays(getCurrentMonth(), getCurrentYear());
        });

        yearBoxTemplate.valueOf().append(yearBoxText);
        calendarBackSide.valueOf().append(yearBoxTemplate.valueOf());
    }
}

const renderEventsList = (eventDate) => {

    const storedEvents = localStorage.getItem(LOCAL_STORAGE_NAME) 
                            ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) 
                            : [];

    if (storedEvents) {
        const currentDayEvents = storedEvents.filter(eventsToday => eventsToday.eventDate === eventDate);

        if (currentDayEvents.length > 0) {
            eventList.empty();

            for (let i = 0; i < currentDayEvents.length; i++) {

                let eventListItemTemplate = KQ('<li>');
        
                eventListItemTemplate.text(currentDayEvents[i].eventDescription);
                eventListItemTemplate.attr('data-event-id', currentDayEvents[i].id);
                eventListItemTemplate.addClass('event-list-item');
        
                eventListItemTemplate.on('click', e => {
                    const currentEventElement   = e.target;
                    const currentEventId        = currentEventElement.getAttribute('data-event-id');
                    removeEvent(currentEventId);
                    renderEventsList(eventDate);
                });
        
                eventList.valueOf().append(eventListItemTemplate.valueOf());
            }
            return; // In order to escape addBlankEventInfo() Otherwise it wont render the newer added events
        }

        addBlankEventInfo(eventList);
    }
}

const createEvent = () => {
    const eventDescription = inputField.valueOf().value;
    const eventDate        = inputField.attr('data-event-info');
    const events           = localStorage.getItem(LOCAL_STORAGE_NAME);
    let obj                = [];
    let id                 = 1;

    if (!eventDescription) return showAlert('wrong-input');

    if (events) obj = JSON.parse(events)

    if (obj.length > 0) id = Math.max.apply('', obj.map(entry => parseFloat(entry.id))) + 1;

    obj.push({
        'id' : id,
        'eventDate': eventDate,
        'eventDescription': eventDescription
    });

    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(obj));
    inputField.valueOf().value = '';
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

    yearHeading.on('click', toggleCalendarSide);
    actionNext.on('click', next);
    actionPrevious.on('click', previous);
    inputFieldButton.on('click', createEvent);
    todayButton.on('click', getTodayLayout);
}

// Startup
init();