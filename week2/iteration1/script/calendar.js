const date = new Date();

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const getDateObj = function() {
    return date;
}

const renderCalendar = () => {
    // Get first day of the current month
    getDateObj().setDate(1);

    const monthDays = KQ('.days');
    const lastOfMonth = new Date(getDateObj().getFullYear(), getDateObj().getMonth() + 1, 0).getDate();
    const prevMonthLastDays = new Date(getDateObj().getFullYear(), getDateObj().getMonth(), 0).getDate();

    const firstDayIndex = getDateObj().getDay();
    const lastDayIndex = new Date(getDateObj().getFullYear(), getDateObj().getMonth() + 1, 0).getDay();
    
    // Formula to display the next month days
    const nextDays = 7 - lastDayIndex - 1;

    KQ('.date h1').html(months[getDateObj().getMonth()]);
    KQ('.date p').html(new Date().toDateString());

    let days = [];
    let template;

    // Determine the previous month days
    for (let i = firstDayIndex; i > 0; i--) {
        template =  `<div class="prev-date">${prevMonthLastDays - i + 1}</div>`;
        days.push(template);
    }

    // Current month days
    for (let i = 1; i <= lastOfMonth; i++) {
        if (i === new Date().getDate() && 
            getDateObj().getMonth() === new Date().getMonth()) {

            template = `<div class="today">${i}</div>`;
            days.push(template);

        } else {
            template = `<div>${i}</div>`;
            days.push(template);
        }

        monthDays.html(days.map(div => `${div}`).join(''));
    }

    // Next month days
    for (let j = 1; j <= nextDays; j++) {
        let template =  `<div class="next-date">${j}</div>`;
        days.push(template);

        monthDays.html(days.map(div => `${div}`).join(''));
    }
};

KQ('.prev').on('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

KQ('.next').on('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
})  

// Initial render
renderCalendar();