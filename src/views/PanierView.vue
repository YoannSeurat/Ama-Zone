<script setup>
import { computed, inject } from 'vue'
import Panier from '../components/Panier.vue'

const store = inject('articlesStore')
const total = computed(() => store.panier.reduce((somme, article) => somme + article.prix, 0))
</script>

<template>
  <main>
    <h1>Panier</h1>
    <Panier :articles="store.panier" @retirer="store.supprimerDuPanier" />
    <p v-if="store.panier.length" class="cart-total">Total : {{ total.toFixed(2) }} €</p>
  </main>
</template>
