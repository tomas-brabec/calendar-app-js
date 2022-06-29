<template>
  <div>
      <h2 v-if="selectedDay">Items {{selectedDay.toLocaleDateString()}}:</h2>
      <h2 v-else>Items:</h2>
      <button :disabled="!selectedDay" @click="showAddItem()">Add item</button>
      <table>
        <tr>
          <th>Date</th>
          <th>Title</th>
        </tr>
        <tr v-for="item in filteredItems" :key="item._id">
          <td>{{new Date(item.date).toLocaleDateString()}}</td>
          <td>{{item.title}}</td>
          <td><button @click="edit(item)">edit</button></td>
          <td><button @click="deleteItem(item)">delete</button></td>
        </tr>
      </table>
      <div v-if="title !== null">
        <h2>Edit item</h2>
        <label>Title</label>
        <input type="text" v-model="title">
        <button @click="save()">save</button>
        <button @click="cancel()">cancel</button>
      </div>
      <div v-if="newItem !== null">
        <h2>Add item</h2>
        <p>Selected day: {{selectedDay.toLocaleDateString()}}</p>
        <label>Title</label>
        <input type="text" v-model="newItem.title">
        <button @click="add()">add</button>
        <button @click="cancel()">cancel</button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Items',
  props: {
    selectedDay: Date,
    items: Array
  },
  data () {
    return {
      id: null,
      title: null,
      newItem: null
    }
  },
  computed: {
    filteredItems () {
      if (this.selectedDay) {
        return this.items.filter(x => {
          return this.isSameDate(new Date(x.date), this.selectedDay)
        }).sort(function (a, b) {
          return new Date(a.date) - new Date(b.date)
        })
      } else {
        const array = this.items.slice()
        return array.sort(function (a, b) {
          return new Date(a.date) - new Date(b.date)
        })
      }
    }
  },
  methods: {
    isSameDate (dateA, dateB) {
      return (dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate())
    },
    edit (item) {
      this.id = item._id
      this.title = item.title
    },
    save () {
      this.$emit('update', { _id: this.id, title: this.title })
      this.id = null
      this.title = null
    },
    deleteItem (item) {
      this.$emit('delete', item)
    },
    showAddItem () {
      this.newItem = { title: '' }
    },
    add () {
      this.$emit('create', { title: this.newItem.title, date: this.selectedDay })
      this.newItem = null
    },
    cancel () {
      this.id = null
      this.title = null
      this.newItem = null
    }
  }
}
</script>
