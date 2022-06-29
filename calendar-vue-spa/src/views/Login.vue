<template>
    <div>
        <h1>Login</h1>
        <p v-if="this.error" class="error">Bad credentials!</p>
        <form action="#" @submit.prevent="login">
        <label>Email</label>
        <input type="email" name="email" class="input" v-model="email">

        <label>Password</label>
        <input type="password" name="password" class="input" v-model="password">
        <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      error: false
    }
  },
  methods: {
    async login () {
      try {
        await this.$store.dispatch('login', { email: this.email, password: this.password })
        this.$router.push({ name: 'Calendar' })
      } catch (e) {
        console.error(e)
        this.email = ''
        this.password = ''
        this.error = true
      }
    }
  }
}
</script>

<style>
</style>
