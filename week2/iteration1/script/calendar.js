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
    getDateObj().setDate(1);

    const monthDays = KQ('.days');
    const lastDay = new Date(getDateObj().getFullYear(), getDateObj().getMonth() + 1, 0).getDate();
    const prevLastDay = new Date(getDateObj().getFullYear(), getDateObj().getMonth(), 0).getDate();
    const firstDayIndex = getDateObj().getDay();
    const lastDayIndex = new Date(getDateObj().getFullYear(), getDateObj().getMonth() + 1, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;

    KQ('.date h1').html(months[getDateObj().getMonth()]);
    KQ('.date p').html(new Date().toDateString());

    let days = [];
    let template;

    for (let i = firstDayIndex; i > 0; i--) {
        template =  `<div class="prev-date">${prevLastDay - i + 1}</div>`;
        days.push(template);
    }

    for (let i = 1; i <= lastDay; i++) {
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