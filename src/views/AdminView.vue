<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import ArticleItem from '../components/ArticleItem.vue'

const store = inject('articlesStore')
const router = useRouter()

function supprimer(articleId) {
  if (window.confirm('Supprimer cet article ?')) {
    store.supprimerArticle(articleId)
  }
}

function modifier(article) {
  router.push(`/article/${article.id}?admin=true&edit=true`)
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
        :admin="true"
        @voir="router.push(`/article/${$event.id}`)"
        @modifier="modifier($event)"
        @supprimer="supprimer($event.id)"
      />
    </section>
  </main>
</template>
