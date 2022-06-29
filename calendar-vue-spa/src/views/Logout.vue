<template>
    <div></div>
</template>

<script>
// Odhlaseni a presmerovani
export default {
  name: 'Logout',
  created () {
    // V souboru store/index.js je metoda logout
    this.$store.dispatch('logout')
    // Presmerovani
    this.$router.push({ name: 'Login' })
  }
}
</script>
