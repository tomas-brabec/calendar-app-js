const express = require('express');

const router = express.Router();

/*
 * GET mesicni aktualni kalendar
 */
router.get('/', function(req, res){
    const date = new Date();
    
    const calendar = createCalendar(new Date(date.getFullYear(), date.getMonth(), 1));
   
    res.render('index.hbs', calendar);
});

/*
 * GET vrati pozadovany mesicni kalendar - parametr :month muze byt cislo i anglicky nazev
 */
router.get('/:month/:year', function(req, res){
    const month = (isNaN(req.params.month))? getMonthNum(req.params.month) : req.params.month - 1;
    const year = req.params.year;

    const date = new Date(year, month, 1);
    const calendar = createCalendar(date);

    res.render('index.hbs', calendar);
});


// Pomocne metody pro generovani objektu calendar
const createCalendar = date => {
    const monthNum = date.getMonth();
    const year = date.getFullYear();
    const years = getYears(year, monthNum);
    
    const calendar = {months :{previous: {month: getMonthName(monthNum - 1), year: years.previous},
    current: {month: getMonthName(monthNum), year: years.current},
    next: {month: getMonthName(monthNum + 1), year: years.next}}};
    
    calendar.titles = {menu: Object.keys(calendar.months), table: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']};
    calendar.weeks = getWeeks(date);

    return calendar;
}

const getYears = (year, monthNum) => {
    const previous = (monthNum == 0)? year - 1 : year;
    const current = year;
    const next =  (monthNum == 11)? year + 1 : year;

    return {previous, current , next};
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

const getMonthName = num => {
    if(num == 12)
        return monthNames[0];
    else if(num == -1)
        return monthNames[11];
    else
        return monthNames[num];
};

const getMonthNum = month => {
    return monthNames.indexOf(month);
};

const getWeeks = date => {
    const weeks = [];
    const today = new Date();
    const dateStart = new Date(date);
    const dayNum = date.getDay();
    let dayNumStart;

    if(dayNum == 0)
        dayNumStart = 6;
    else 
        dayNumStart = dayNum - 1;

    dateStart.setDate(dateStart.getDate() - dayNumStart);
    const daysCount = daysInMonth(date);
    let lastWeek = false;

    while(!lastWeek){
        const week = [];
        for(let i = 0; i < 7; i++){
            if(dateStart.getMonth() === date.getMonth()){
                if(dateStart.getDate() === daysCount)
                    lastWeek = true;

                if(dateStart.isSameDateAs(today))
                    week.push({day: dateStart.getDate(), bold: true, today: true});
                else
                    week.push({day: dateStart.getDate(), bold: true, today: false});
            }
            else{
                if(dateStart.isSameDateAs(today))
                    week.push({day: dateStart.getDate(), bold: false, today: true});
                else
                    week.push({day: dateStart.getDate(), bold: false, today: false});
            }
            
            dateStart.setDate(dateStart.getDate() + 1);
        }
        weeks.push({week});
    }

    return weeks;
};

const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

Date.prototype.isSameDateAs = function(pDate) {
    return (
      this.getFullYear() === pDate.getFullYear() &&
      this.getMonth() === pDate.getMonth() &&
      this.getDate() === pDate.getDate()
    );
};

module.exports = router;