<script setup>
import ArticleItem from './ArticleItem.vue'

defineProps({
  articles: {
    type: Array,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  nombrePages: {
    type: Number,
    required: true,
  },
})

defineEmits(['changer-page', 'voir', 'ajouter', 'supprimer'])
</script>

<template>
  <p v-if="!articles.length" class="empty-state">Aucun article ne correspond à votre recherche.</p>
  <section v-else class="article-grid">
    <ArticleItem
      v-for="article in articles"
      :key="article.id"
      :article="article"
      @voir="$emit('voir', $event)"
      @ajouter="$emit('ajouter', $event)"
      @supprimer="$emit('supprimer', $event)"
    />
  </section>
  <nav v-if="nombrePages > 1" class="pagination" aria-label="Pagination">
    <button type="button" :disabled="page === 1" @click="$emit('changer-page', page - 1)">Précédent</button>
    <span>Page {{ page }} sur {{ nombrePages }}</span>
    <button type="button" :disabled="page === nombrePages" @click="$emit('changer-page', page + 1)">Suivant</button>
  </nav>
</template>
