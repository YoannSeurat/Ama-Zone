<script setup>
defineProps({
  article: {
    type: Object,
    required: true,
  },
})

defineEmits(['voir', 'ajouter', 'supprimer'])
</script>

<template>
  <article class="article-card">
    <img :src="article.image" :alt="article.titre" />
    <div class="article-card__body">
      <p class="eyebrow">{{ article.categorie }}</p>
      <h2>{{ article.titre }}</h2>
      <p>{{ article.description }}</p>
      <strong>{{ article.prix.toFixed(2) }} €</strong>
      <div class="article-card__actions">
        <button type="button" @click="$emit('voir', article)">Détails</button>
        <button type="button" @click="$emit('ajouter', article)">Ajouter au panier</button>
        <button class="danger-button" type="button" @click="$emit('supprimer', article)">Supprimer</button>
      </div>
    </div>
  </article>
</template>
