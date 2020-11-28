const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date = new Date();
const getDateObj = function() { return date; }

const daysOfNextOrPrevMonthToShow = 6;

const renderCalendar = () => {
    let calendarDaysTemplate;
    let daysCollection = [];
    // Get first day of the current month
    getDateObj().setDate(1);

    const calendarDaysLayout    = KQ('.calendar-days--layout');

    const currentMonthDays      = new Date( getDateObj().getFullYear(),
                                            getDateObj().getMonth() + 1, 0)
                                            .getDate();

    const prevMonthDays         = new Date( getDateObj().getFullYear(),
                                            getDateObj().getMonth(), 0)
                                            .getDate();

    const firstDayIndex         = getDateObj().getDay();
    const lastDayIndex          = new Date( getDateObj().getFullYear(),
                                            getDateObj().getMonth() + 1, 0).
                                            getDay();
    
    // Formula to display the next month days
    const nextDays = daysOfNextOrPrevMonthToShow - lastDayIndex;

    KQ('.calendar-month-text h1').html(MONTHS[getDateObj().getMonth()]);
    KQ('.calendar-month-text p').html(new Date().toDateString());

    // Determine the previous month days
    for (let i = firstDayIndex; i > 0; i--) {
        calendarDaysTemplate =  `<div class="prev-date">${prevMonthDays - i + 1}</div>`;
        daysCollection.push(calendarDaysTemplate);
    }

    // Current month days
    for (let i = 1; i <= currentMonthDays; i++) {
        const today = i === new Date().getDate() && getDateObj().getMonth() === new Date().getMonth();

        if (!today) {
            calendarDaysTemplate = `<div>${i}</div>`;
            daysCollection.push(calendarDaysTemplate);
        }

        if (today) {
            calendarDaysTemplate = `<div class="today">${i}</div>`;
            daysCollection.push(calendarDaysTemplate);
        }

        calendarDaysLayout.html(daysCollection.map(div => `${div}`).join(''));
    }

    // Next month days
    for (let j = 1; j <= nextDays; j++) {
        let calendarDaysTemplate =  `<div class="next-date">${j}</div>`;
        daysCollection.push(calendarDaysTemplate);

        calendarDaysLayout.html(daysCollection.map(div => `${div}`).join(''));
    }
};


KQ('.prev-btn').on('click', () => {
    getDateObj().setMonth(getDateObj().getMonth() - 1);
    renderCalendar();
});

KQ('.next-btn').on('click', () => {
    getDateObj().setMonth(getDateObj().getMonth() + 1);
    renderCalendar();
})  

// Initial render
renderCalendar();