<script setup>
import { computed, inject } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = inject('articlesStore')
const article = computed(() => store.articles.find((item) => item.id === Number(route.params.id)))
</script>

<template>
  <main v-if="article">
    <img class="detail-image" :src="article.image" :alt="article.titre" />
    <p class="eyebrow">{{ article.categorie }}</p>
    <h1>{{ article.titre }}</h1>
    <p>{{ article.description }}</p>
    <p>{{ article.prix.toFixed(2) }} €</p>
    <button type="button" @click="store.ajouterAuPanier(article)">Ajouter au panier</button>
    <RouterLink class="back-link" to="/articles">Retour aux articles</RouterLink>
  </main>
  <main v-else>
    <h1>Article introuvable</h1>
    <RouterLink to="/articles">Retour aux articles</RouterLink>
  </main>
</template>
