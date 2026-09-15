<script setup>
import { inject } from 'vue'
import ArticleItem from '../components/ArticleItem.vue'

const store = inject('articlesStore')

function supprimer(articleId) {
  if (window.confirm('Supprimer cet article ?')) {
    store.supprimerArticle(articleId)
  }
}
</script>

<template>
  <main>
    <h1>Administration</h1>
    <p>Bonjour {{ store.session.username }}.</p>
    <section class="article-grid">
      <ArticleItem
        v-for="article in store.articles"
        :key="article.id"
        :article="article"
        @ajouter="store.ajouterAuPanier($event)"
        @supprimer="supprimer($event.id)"
      />
    </section>
  </main>
</template>
