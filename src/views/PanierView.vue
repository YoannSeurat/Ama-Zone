<script setup>
import { computed, inject } from 'vue'
import Panier from '../components/Panier.vue'

const store = inject('articlesStore')
const total = computed(() =>
  store.panier.reduce((somme, article) => somme + article.prix * (article.quantite || 1), 0),
)
</script>

<template>
  <main class="cart-page">
    <h1>Panier</h1>
    <div class="cart-layout">
      <Panier
        :articles="store.panier"
        @ajouter="store.ajouterAuPanier"
        @enlever="store.enleverDuPanier"
        @retirer="store.supprimerDuPanier"
      />
      <aside v-if="store.panier.length" class="cart-summary">
        <div class="cart-summary__line cart-summary__total">
          <span>Total</span>
          <strong>{{ total.toFixed(2) }} €</strong>
        </div>
      </aside>
    </div>
  </main>
</template>
