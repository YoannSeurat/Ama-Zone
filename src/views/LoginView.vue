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
  <main class="login-page">
    <div class="login-page__heading">
      <h2>Connexion</h2>
    </div>

    <section class="login-page__panel">
      <form class="login-form" @submit.prevent="seConnecter">
        <label class="login-form__label" for="login-name">Nom</label>
        <input
          id="login-name"
          v-model.trim="username"
          class="login-form__input"
          autocomplete="username"
          placeholder="e.g. admin"
          required
        />
        <button class="login-form__submit" type="submit">
          <span>Se connecter</span>
          <img src="/icons/front arrow white.svg" alt="" />
        </button>
      </form>
    </section>
  </main>
</template>
