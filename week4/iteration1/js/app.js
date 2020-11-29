const calendarMonthListNameList = document.querySelector('.calendar-months--layout');
const calendarWeekDaysNameList  = document.querySelector('.calendar-week-days-names--layout');
const calendarWeekDaysBody      = document.querySelector('.calendar-month-days-list');
const monthHeading              = document.querySelector('.calendar-month--text');
const yearHeading               = document.querySelector('.calendar-year--text');



const MONTHS         = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL    = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS           = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const daysAfterTheMonthStarted = 32;


let today           = new Date();
let todayIndex      = today.getDate();
let currentMonth    = today.getMonth();
let currentYear     = today.getFullYear();


const init = function() {
    renderAll();
    renderDays(currentMonth, currentYear);
}


const renderAll = function() {
    renderMonthNames();
    renderWeekNames();
}


const renderMonthNames = function() {
    MONTHS.forEach(month => {
        let monthsTemplate = document.createElement('div');
        monthsTemplate.textContent = `${month}`;

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



const renderDays = function(month, year) {

    // let firstDayInMonth = new Date(year, month).getDay();
    let totalDaysInMonth = daysInMonth(month, year);

    calendarWeekDaysBody.innerHTML = '';

    for (let day = 1; day <= totalDaysInMonth; day++) {
        let cell = document.createElement('div');
        let cellText = document.createTextNode(day);

        if (isToday(day)) cell.classList.add('active');

        cell.setAttribute('data-day', day);
        cell.setAttribute('data-month', month);
        cell.setAttribute('data-year', year);

        cell.appendChild(cellText);
        calendarWeekDaysBody.appendChild(cell);

        monthHeading.textContent = MONTHS_FULL[month];
        yearHeading.textContent = year;
    }
}


function isToday(day) {
    return  todayIndex   === day                 && 
            currentMonth === today.getMonth()    && 
            currentYear  === today.getFullYear();
}

function daysInMonth(month, year) {
	// day 0 here returns the last day of the PREVIOUS month
	return new Date(year, month + 1, 0).getDate();
}



// Initial rendering
init();