<script setup>
import { ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const store = inject('articlesStore')
const route = useRoute()
const router = useRouter()
const username = ref('')

function seConnecter() {
  store.connecter(username.value)
  router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/admin')
}
</script>

<template>
  <main>
    <h1>Connexion</h1>
    <form @submit.prevent="seConnecter">
      <label>Nom <input v-model.trim="username" required /></label>
      <button type="submit">Se connecter</button>
    </form>
  </main>
</template>
