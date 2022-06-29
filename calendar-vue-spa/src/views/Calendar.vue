<template>
  <div>
    <p>Hello {{this.$store.state.username}}</p>
    <h1>Monthly calendar</h1>
    <table>
      <tr>
        <th v-for="title in calendar.titles.menu" :key="title">{{capitalizeFirstLetter(title)}}</th>
      </tr>
      <tr>
        <td v-for="item in calendar.months" :key="item.month">
          <router-link :to="{ name: 'Calendar', params: {month: getMonthNum(item.month), year: item.year} }">{{item.month}} {{item.year}}</router-link>
        </td>
      </tr>
    </table>
    <Month v-bind:calendar="this.calendar" v-bind:date="this.selectedDate"
    v-bind:selectedDay="this.selectedDay" v-on:selectDay="setSelectedDay" v-bind:items="this.items" />
    <Items v-bind:items="this.items" v-bind:selectedDay="this.selectedDay" v-on:update="updateItem" v-on:delete="deleteItem" v-on:create="createItem" />
  </div>
</template>

<script>
import Month from '@/components/Month.vue'
import Items from '@/components/Items.vue'
import Util from '@/utils/calendar.js'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Month,
    Items
  },
  data () {
    return {
      selectedDate: '',
      selectedDay: '',
      items: []
    }
  },
  created () {
    const actualDate = new Date()
    const month = this.$route.params.month
    const year = this.$route.params.year
    this.selectedDate = new Date((year) || actualDate.getFullYear(), (month) ? month - 1 : actualDate.getMonth())
    this.getItems()
  },
  computed: {
    calendar () {
      return Util.createCalendar(this.selectedDate)
    }
  },
  methods: {
    getMonthNum (month) {
      return Util.getMonthNum(month) + 1
    },
    capitalizeFirstLetter (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    setSelectedDay (date) {
      this.selectedDay = date
    },
    async getItems () {
      try {
        const token = this.$store.state.token
        const date = Util.getDays(this.selectedDate)
        const res = await axios.post('http://localhost:3000/api/item/find', {
          from: date.from,
          to: date.to
        }, { headers: { Authorization: `Bearer ${token}` } })
        this.items = res.data.items
      } catch (e) {
        console.error(e)
      }
    },
    async updateItem (item) {
      try {
        const token = this.$store.state.token
        const res = await axios.patch('http://localhost:3000/api/item', { _id: item._id, title: item.title }, { headers: { Authorization: `Bearer ${token}` } })
        const uitem = this.items.find(x => x._id === res.data._id)
        uitem.title = res.data.title
      } catch (e) {
        console.error(e)
      }
    },
    async deleteItem (item) {
      try {
        const token = this.$store.state.token
        const res = await axios.delete('http://localhost:3000/api/item', { data: { _id: item._id }, headers: { Authorization: `Bearer ${token}` } })
        this.items = this.items.filter(x => x._id !== res.data._id)
      } catch (e) {
        console.error(e)
      }
    },
    async createItem (item) {
      try {
        const token = this.$store.state.token
        const res = await axios.post('http://localhost:3000/api/item', { title: item.title, date: item.date }, { headers: { Authorization: `Bearer ${token}` } })
        this.items.push(res.data.item)
      } catch (e) {
        console.error(e)
      }
    }
  },
  watch: {
    $route (to, from) {
      const actualDate = new Date()
      const month = this.$route.params.month
      const year = this.$route.params.year
      this.selectedDate = new Date((year) || actualDate.getFullYear(), (month) ? month - 1 : actualDate.getMonth())
      this.selectedDay = null
      this.getItems()
    }
  }
}
</script>

<style>
table {
    border-collapse: collapse;
    border: 2px solid black;
}
th, td{
    padding: 8px;
    text-align: center;
    border: 1px solid black;
}
.month td{
    cursor: pointer;
}
.bold{
    font-weight: bold;
    background-color: lightgreen;
}
.today{
    font-weight: bold;
    border: 2px solid black;
    background-color: lightskyblue;
}
.selected{
    background-color: lightcoral;
}
</style>
