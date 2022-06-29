const createCalendar = date => {
  const monthNum = date.getMonth()
  const year = date.getFullYear()
  const years = getYears(year, monthNum)
  const correctDate = new Date(year, monthNum, 1)

  const calendar = {
    months: {
      previous: { month: getMonthName(monthNum - 1), year: years.previous },
      current: { month: getMonthName(monthNum), year: years.current },
      next: { month: getMonthName(monthNum + 1), year: years.next }
    }
  }

  calendar.titles = { menu: Object.keys(calendar.months), table: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }
  calendar.weeks = getWeeks(correctDate)

  return calendar
}

const getDays = date => {
  const monthNum = date.getMonth()
  const year = date.getFullYear()
  const correctDate = new Date(year, monthNum, 1)
  const weeks = getWeeks(correctDate)
  const from = weeks[0].week[0].day
  const to = weeks[weeks.length - 1].week[6].day
  return { from, to }
}

const getYears = (year, monthNum) => {
  const previous = (monthNum === 0) ? year - 1 : year
  const current = year
  const next = (monthNum === 11) ? year + 1 : year

  return { previous, current, next }
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const getMonthName = num => {
  if (num === 12) { return monthNames[0] } else if (num === -1) { return monthNames[11] } else { return monthNames[num] }
}

const getMonthNum = month => {
  return monthNames.indexOf(month)
}

const getWeeks = date => {
  const weeks = []
  const dateStart = new Date(date)
  const dayNum = date.getDay()
  let dayNumStart

  if (dayNum === 0) { dayNumStart = 6 } else { dayNumStart = dayNum - 1 }

  dateStart.setDate(dateStart.getDate() - dayNumStart)
  const daysCount = daysInMonth(date)

  let lastWeek = false

  while (!lastWeek) {
    const week = []
    for (let i = 0; i < 7; i++) {
      if (dateStart.getMonth() === date.getMonth() && dateStart.getDate() === daysCount) { lastWeek = true }

      week.push({ day: new Date(dateStart) })
      dateStart.setDate(dateStart.getDate() + 1)
    }
    weeks.push({ week })
  }

  return weeks
}

const daysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export default { createCalendar, getMonthNum, getDays }
