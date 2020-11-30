const calendarMonthListNameList = document.querySelector('.calendar-months--layout');
const calendarWeekDaysNameList  = document.querySelector('.calendar-week-days-names--layout');
const calendarWeekDaysBody      = document.querySelector('.calendar-month-days-list');
const monthHeading              = document.querySelector('.calendar-month--text');
const yearHeading               = document.querySelector('.calendar-year--text');
const actionPrevious            = document.querySelector('.action--previous');
const actionNext                = document.querySelector('.action--next');
const calendarBackSide          = document.querySelector('.calendar-back-side');
const calendarContainer         = document.querySelector('.calendar--layout');

let calendarBackSideYears       = null;


const MONTHS         = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL    = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS           = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const daysAfterTheMonthStarted = 32;


let today           = new Date();
let todayIndex      = today.getDate();
let currentMonth    = today.getMonth();
let currentYear     = today.getFullYear();


const init = function() {
    renderAll();
    eventTriggers();
}


const renderAll = function() {
    renderDays(currentMonth, currentYear);
    renderMonthNames();
    renderWeekNames();
    renderYearBackSelection(2010, 2045);
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


const renderDays = function(month, year) {

    let firstDayOfWeek = new Date(year, month).getDay();

    let totalDaysInMonth = daysInMonth(month, year);

    calendarWeekDaysBody.innerHTML = '';

    // adding the blank boxes so that date start on correct day of the week
    fillBlankDays(firstDayOfWeek);

    for (let day = 1; day <= totalDaysInMonth; day++) {
        let cell = document.createElement('div');
        let cellText = document.createTextNode(day);

        if (isToday(day)) {
            cell.classList.add('active');
        }

        cell.setAttribute('data-day', day);
        cell.setAttribute('data-month', month);
        cell.setAttribute('data-year', year);

        cell.appendChild(cellText);
        calendarWeekDaysBody.appendChild(cell);

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

        calendarWeekDaysNameList.appendChild(daysTemplate);
    });
}

// 42 years is suitable for layout
const renderYearBackSelection = function(startYear, endYear) {
    if (endYear - startYear > 42) {
        return console.warn('Please enter other value!');
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
        document.querySelector(".flip-container").classList.toggle("flip");
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
    });
}


// Startup
init();