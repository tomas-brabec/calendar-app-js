const express = require('express');
const logger = require('morgan');
const path = require('path');
const hbs = require('hbs');
const cors = require('cors');

const userRouter = require('./routes/user');
const itemRouter = require('./routes/item');
const templateCalendarRouter = require('./routes/templateCalendar');
require('./database/mongodb');

const app = express();
const port = process.env.PORT || 3000;

const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');
const publicDirectoryPath = path.join(__dirname, '../public')

hbs.registerPartials(partialsPath);

/*
 * Vlastni funkce v sablonach
 */
hbs.registerHelper('capitalizeFirstLetter', function(str) {
    const result = str.charAt(0).toUpperCase() + str.slice(1);
    return new hbs.SafeString(result);
});
hbs.registerHelper('link', function(month, year) {
    return new hbs.SafeString(`<a href="/calendar/${month}/${year}">${month} ${year}</a>`);
});
hbs.registerHelper('dateStyle', function(day, bold, today) {
    const classBold = (bold)? 'bold' : '';
    const classToday = (today)? 'today' : '';
    const space = (bold && today)? ' ' : '';
    
    return new hbs.SafeString(`<td class="${classBold}${space}${classToday}">${day}</td>`);
});

app.set('view engine', 'hbs');
app.set('views', viewsPath);

/*
 * Automaticke logovani pozadavku na server
 * https://www.npmjs.com/package/morgan
 */
app.use(logger('dev'));

app.use(cors());

app.use(express.static(publicDirectoryPath))
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/item', itemRouter);
app.use('/calendar', templateCalendarRouter);

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});