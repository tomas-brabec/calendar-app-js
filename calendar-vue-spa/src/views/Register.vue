<template>
    <div>
        <h1>Register</h1>
        <p v-if="this.error" class="error">Error!</p>
        <form action="#" @submit.prevent="register">
        <label>Name</label>
        <input type="text" name="name" class="input" v-model="name">

        <label>Email</label>
        <input type="email" name="email" class="input" v-model="email">

        <label>Password</label>
        <input type="password" name="password" class="input" v-model="password">
        <button :disabled="isEmpty || !isValidPassword" type="submit">Register</button>
        </form>
        <p class="message" v-if="!isEmpty && !isValidPassword">Password minimal length is 8 and must contains letters [a-zA-Z], digits [0-9], special characters [!#$%&? "]</p>
    </div>
</template>

<script>
// Oblsuha formulare pro registraci
export default {
  name: 'Register',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      error: false
    }
  },
  computed: {
    isEmpty () {
      return this.name === '' || this.email === '' || this.password === ''
    },
    isValidPassword () {
      return /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/g.test(this.password)
    }
  },
  methods: {
    async register () {
      try {
        await this.$store.dispatch('register', { name: this.name, email: this.email, password: this.password })
        this.$router.push({ name: 'Calendar' })
      } catch (e) {
        console.error(e)
        this.name = ''
        this.email = ''
        this.password = ''
        this.error = true
      }
    }
  }
}
</script>
