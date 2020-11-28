const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date = new Date();
const getDateObj = function() { return date; }

const daysOfNextOrPrevMonthToShow = 6;

const renderCalendar = () => {
    // Get first day of the current month
    getDateObj().setDate(1);

    const calendarDaysLayout    = KQ('.calendar-days--layout');
    const monthDays             = new Date( getDateObj().getFullYear(),
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

    let template;
    // Days storage
    let days = [];
    // Determine the previous month days
    for (let i = firstDayIndex; i > 0; i--) {
        template =  `<div class="prev-date">${prevMonthDays - i + 1}</div>`;
        days.push(template);
    }

    // Current month days
    for (let i = 1; i <= monthDays; i++) {
        const today = i === new Date().getDate() && getDateObj().getMonth() === new Date().getMonth();

        if (!today) {
            template = `<div>${i}</div>`;
            days.push(template);
        }

        if (today) {
            template = `<div class="today">${i}</div>`;
            days.push(template);
        }

        calendarDaysLayout.html(days.map(div => `${div}`).join(''));
    }

    // Next month days
    for (let j = 1; j <= nextDays; j++) {
        let template =  `<div class="next-date">${j}</div>`;
        days.push(template);

        calendarDaysLayout.html(days.map(div => `${div}`).join(''));
    }
};


KQ('.prev-btn').on('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

KQ('.next-btn').on('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
})  

// Initial render
renderCalendar();