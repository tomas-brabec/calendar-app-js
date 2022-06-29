<template>
  <div id="app">
    <!-- Menu -->
    <div id="nav">
      <router-link :to="{ name: 'Calendar' }">Calendar</router-link> |
      <template v-if="!loggedIn">
      <router-link :to="{ name: 'Login' }">Login</router-link> |
      <router-link :to="{ name: 'Register' }">Register</router-link>
      </template>
      <router-link :to="{ name: 'Logout' }" v-else>Logout</router-link>
    </div>
    <!-- Zobrazeni obsahu jednotlivch stranek -->
    <router-view/>
  <div>
    <p>Tomáš Brabec 2020 TNPW2</p>
    <img class="projekt" alt="Vue logo" src="@/assets/projekt.svg">
  </div>
  </div>
</template>

<script>
// App je hlavni sablona
export default {
  name: 'App',
  computed: {
    loggedIn () {
      return this.$store.getters.loggedIn
    }
  }
}
</script>

<style>
img.projekt{
    height: 22px;
}
.input{
    margin: 15px 30px 10px 15px;
}
.error{
    background-color: lightcoral;
}
.message{
    background-color: lightsalmon;
}
</style>
