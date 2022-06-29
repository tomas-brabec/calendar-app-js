<template>
  <div>
    <h2>{{calendar.months.current.month}} {{calendar.months.current.year}}</h2>
    <table class="month">
      <tr>
        <th v-for="title in calendar.titles.table" :key="title">{{title}}</th>
      </tr>
      <tr v-for="weeks in calendar.weeks" :key="weeks">
        <td v-for="days in weeks.week" :key="days.day" :class="{ bold : isBold(days.day), today: isToday(days.day), selected: isSelected(days.day)}" v-on:click="$emit('selectDay', days.day)">{{days.day.getDate()}}
          <p v-if="getItemCount(days.day) > 0" class="count">item: {{getItemCount(days.day)}}</p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Month',
  props: {
    calendar: Object,
    date: Date,
    selectedDay: Date,
    items: Array
  },
  data () {
    return {
      today: new Date()
    }
  },
  computed: {
  },
  methods: {
    isBold (date) {
      return this.date.getMonth() === date.getMonth()
    },
    isToday (date) {
      return (this.today.getFullYear() === date.getFullYear() &&
      this.today.getMonth() === date.getMonth() &&
      this.today.getDate() === date.getDate())
    },
    isSelected (date) {
      if (this.selectedDay) {
        return (this.selectedDay.getFullYear() === date.getFullYear() &&
        this.selectedDay.getMonth() === date.getMonth() &&
        this.selectedDay.getDate() === date.getDate())
      } else {
        return false
      }
    },
    getItemCount (date) {
      const itemsList = this.items
      return itemsList.filter(x => {
        const aDate = new Date(date)
        const itemDate = new Date(x.date)
        return this.isSameDate(aDate, itemDate)
      }).length
    },
    isSameDate (dateA, dateB) {
      return (dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate())
    }
  }
}
</script>

<style scoped>
.count{
  margin: 0px;
  font-weight: normal;
  background-color: silver;
}
</style>
